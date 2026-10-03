// Lista de navegadores conectados esperando avisos
const clients = new Set();

export const addClient = (res) => {
  clients.add(res);
};

export const removeClient = (res) => {
  clients.delete(res);
};

// Le avisa a TODOS los conectados que algo cambió
export const broadcast = (tipo, datos = {}) => {
  const mensaje = `data: ${JSON.stringify({ tipo, ...datos })}\n\n`;
  for (const res of clients) {
    res.write(mensaje);
  }
};