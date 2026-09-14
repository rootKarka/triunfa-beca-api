import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import solicitudInfoRoutes from './modules/public/solicitudes-info/solicitudes-info.routes.js';
import solicitudMatriculaRoutes from './modules/public/solicitudes-matricula/solicitudes-matricula.routes.js';
import catalogosRoutes from './modules/public/catalogos/catalogos.routes.js';
import adminCatalogosRoutes from './modules/admin/catalogos/catalogos.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

const app = express();

app.use(cors({ origin: env.corsOrigins || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/solicitudes', solicitudInfoRoutes);
app.use('/api/v1/solicitudes', solicitudMatriculaRoutes);
app.use('/api/v1/catalogos', catalogosRoutes);
app.use('/api/v1/admin/catalogos', adminCatalogosRoutes);
app.use('/api/v1/admin/auth',authRoutes);

app.use((req, res) => res.status(404).json({ status: 'fail', message: 'Ruta no encontrada' }));

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
});

export default app;