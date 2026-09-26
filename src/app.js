import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import env from './config/env.js';

import solicitudInfoRoutes from './modules/public/solicitudes-info/solicitudes-info.routes.js';
import solicitudMatriculaRoutes from './modules/public/solicitudes-matricula/solicitudes-matricula.routes.js';
import catalogosRoutes from './modules/public/catalogos/catalogos.routes.js';
import imagenesPublicRoutes from './modules/public/images/images.routes.js';

import imagenesRoutes from './modules/admin/imagenes/imagenes.routes.js';
import adminCatalogosRoutes from './modules/admin/catalogos/catalogos.routes.js';
import seccionesRoutes from './modules/admin/secciones/secciones.routes.js';
import navegacionRoutes from './modules/admin/navegacion/navegacion.routes.js';
import auditoriaRoutes from './modules/admin/auditoria/auditoria.routes.js';
import authRoutes from './modules/auth/auth.routes.js';

//secciones publicas
import seccionesPublicasRoutes from './modules/public/secciones/secciones.routes.js';

//navegacion publica
import navegacionPublicaRoutes from './modules/public/navegacion/navegacion.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors({ origin: env.corsOrigins || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use('/api/v1/solicitudes', solicitudInfoRoutes);
app.use('/api/v1/solicitudes', solicitudMatriculaRoutes);
app.use('/api/v1/catalogos', catalogosRoutes);
app.use('/api/v1/public/imagenes', imagenesPublicRoutes);

// Rutas administrativas
app.use('/api/v1/admin/imagenes', imagenesRoutes);
app.use('/api/v1/admin/catalogos', adminCatalogosRoutes);
app.use('/api/v1/admin/secciones', seccionesRoutes);
app.use('/api/v1/admin/navegacion', navegacionRoutes);
app.use('/api/v1/admin/auditoria', auditoriaRoutes);
app.use('/api/v1/admin/auth', authRoutes);

//Rutas de Secciones Publicas
app.use('/api/v1/public/secciones', seccionesPublicasRoutes);

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//Rutas de Navegacion Publica
app.use('/api/v1/public/navegacion', navegacionPublicaRoutes);

// 404
app.use((req, res) => res.status(404).json({
  status: 'fail',
  message: 'Ruta no encontrada',
}));

// Errores
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
});

export default app;