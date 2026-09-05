import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import solicitudInfoRoutes from './modules/public/solicitudes-info/solicitudes-info.routes.js';
import matriculaRoutes from './modules/public/solicitudes-matricula/solicitudes-matricula.routes.js'


const app = express();

// Middlewares globales
app.use(cors({ origin: env.corsOrigins || '*' })); // Fallback a '*' por si acaso
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Montar rutas de la API
app.use('/api/v1/solicitudes', solicitudInfoRoutes);
app.use('/api/v1/solicitudes', matriculaRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ status: 'fail', message: 'Ruta no encontrada' });
});

// Manejador global de errores (500)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

// Exportamos la app configurada, pero NO la levantamos aquí
export default app;