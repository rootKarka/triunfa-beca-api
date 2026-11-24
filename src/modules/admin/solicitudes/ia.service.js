import { listarPlantillas } from '../plantillas/plantillas.service.js';
import solicitudesService from './solicitudes.service.js';
import { AppError } from '../../../shared/app-error.js';

const TIMEOUT_MS = 25000; // máximo de espera por intento
const MAX_INTENTOS = 3;
// Errores temporales de Google: vale la pena reintentar
const REINTENTABLES = new Set([500, 502, 503, 504]);

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// "javier biktu chamik" -> "Javier Biktu Chamik"
const capitalizar = (texto = '') =>
  texto
    .trim()
    .split(/\s+/)
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1).toLowerCase() : ''))
    .join(' ');

async function llamarGemini(model, apiKey, instrucciones, prompt, conConfig) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const body = {
    systemInstruction: { parts: [{ text: instrucciones }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };

  // Para un mensaje corto no hace falta razonar mucho: respuesta más rápida.
  // En .env puedes poner GEMINI_THINKING_LEVEL=off para no enviar este ajuste.
  const nivel = process.env.GEMINI_THINKING_LEVEL || 'low';
  if (conConfig && nivel !== 'off') {
    body.generationConfig = {
      maxOutputTokens: 800,
      thinkingConfig: { thinkingLevel: nivel },
    };
  }

  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(body),
        signal: controller.signal,
      },
    );
  } finally {
    clearTimeout(timer);
  }
}

async function generarTexto(apiKey, instrucciones, prompt) {
  const principal = process.env.GEMINI_MODEL || 'gemini-4-hydrogen';
  const respaldo = process.env.GEMINI_FALLBACK_MODEL; // opcional
  const modelos = respaldo ? [principal, respaldo] : [principal];

  let conConfig = true;
  let ultimoStatus = 502;

  for (const model of modelos) {
    for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
      const inicio = Date.now();
      let res;

      try {
        res = await llamarGemini(model, apiKey, instrucciones, prompt, conConfig);
      } catch (error) {
        // Tiempo agotado o problema de red
        ultimoStatus = 504;
        console.error(
          `Gemini sin respuesta (${model}, intento ${intento}) tras ${Date.now() - inicio} ms:`,
          error.name,
        );
        if (intento < MAX_INTENTOS) await esperar(intento * 1000);
        continue;
      }

      if (res.ok) {
        const data = await res.json();
        console.log(`Gemini respondio en ${Date.now() - inicio} ms (${model})`);
        return data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
      }

      ultimoStatus = res.status;
      console.error(
        `Gemini error (${model}, intento ${intento}, ${Date.now() - inicio} ms):`,
        res.status,
        await res.text(),
      );

      // Si rechazó el ajuste de razonamiento, probar sin él
      if (res.status === 400 && conConfig) {
        console.error('Reintentando sin generationConfig...');
        conConfig = false;
        continue;
      }

      // 429 (cuota), 403, 404: reintentar no sirve
      if (!REINTENTABLES.has(res.status)) break;

      if (intento < MAX_INTENTOS) await esperar(intento * 1000);
    }
  }

  throw new AppError(
    ultimoStatus === 429 ? 429 : 502,
    ultimoStatus === 429
      ? 'Se alcanzó el límite de uso de la IA. Intenta en unos minutos'
      : 'La IA está saturada ahora mismo. Intenta de nuevo en unos segundos',
  );
}

export async function sugerirRespuesta(id) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new AppError(500, 'Falta GEMINI_API_KEY en el .env');

  const sol = await solicitudesService.getById(id);
  if (!sol) throw new AppError(404, 'Solicitud no encontrada');

  // Datos NO personales (sin nombre, DNI, celular ni correo)
  const datos = {
    servicio: sol.servicio || '',
    nivel: sol.nivel || '',
    grado: sol.grado || '',
    turno: sol.turno || '',
  };

  const pedido = {
    tipo: sol.tipo,
    ...datos,
    mensaje: sol.mensaje, // texto libre del usuario: puede traer datos personales
  };

  const noDisponibles = Object.entries(datos)
    .filter(([, valor]) => !valor)
    .map(([clave]) => clave);

  const plantillas = await listarPlantillas();
  const base = plantillas
    .map((p) => `- [${p.categoria}] ${p.titulo}: ${p.mensaje}`)
    .join('\n');

  const instrucciones = `Eres asistente de la Academia Triunfa Beca (Perú).
Redacta UN mensaje corto de WhatsApp en español, cálido y claro, para responder lo que la familia pidió.
Usa SOLO la información de las plantillas. No inventes precios, horarios ni requisitos.
Si falta información, invita a escribir o llamar.
Marcadores permitidos, escritos exactamente así: {apoderado}, {nombre}, {grado}, {nivel}, {servicio}, {turno}.
Usa un marcador solo si ese dato está disponible. Si un dato no está disponible, redacta sin mencionarlo.
Las plantillas pueden traer "??" en lugar de tildes o signos (¿ ¡ ñ). Corrígelos con la ortografía correcta del español.
Devuelve solo el mensaje, sin explicaciones.`;

  const prompt = `PLANTILLAS:\n${base}\n\nPEDIDO:\n${JSON.stringify(pedido)}\n\nDATOS NO DISPONIBLES (no uses estos marcadores): ${
    noDisponibles.join(', ') || 'ninguno'
  }`;

  const texto = await generarTexto(apiKey, instrucciones, prompt);
  if (!texto) throw new AppError(502, 'La IA devolvió una respuesta vacía');

  // Los datos personales se rellenan aquí, la IA nunca los recibe
  const valores = {
    apoderado: capitalizar(sol.apoderadoNombre || sol.nombres) || 'familia',
    nombre: capitalizar(sol.nombres) || 'su hijo(a)',
    grado: datos.grado,
    nivel: datos.nivel,
    servicio: datos.servicio,
    turno: datos.turno,
  };

  // Reemplaza todos los marcadores; los desconocidos o vacíos se quitan
  let limpio = texto.replace(/\{(\w+)\}/g, (_m, clave) => valores[clave] ?? '');

  limpio = limpio
    .replace(/\(\s*[-–—,·]+\s*/g, '(') // "( - Primaria)" -> "(Primaria)"
    .replace(/\s*[-–—,·]+\s*\)/g, ')') // "(Primaria - )" -> "(Primaria)"
    .replace(/\s*\(\s*\)/g, '') // paréntesis vacíos
    .replace(/ {2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1') // espacio antes de signos
    .trim();

  return limpio;
}