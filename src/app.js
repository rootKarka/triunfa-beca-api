import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import env from './config/env.js';

// Middlewares compartidos
import { authMiddleware } from './shared/auth.middleware.js';
import { notFoundHandler, errorHandler } from './shared/error-handler.js';

// Rutas públicas
import solicitudInfoRoutes from './modules/public/solicitudes-info/solicitudes-info.routes.js';
import solicitudMatriculaRoutes from './modules/public/solicitudes-matricula/solicitudes-matricula.routes.js';
import catalogosRoutes from './modules/public/catalogos/catalogos.routes.js';
import imagenesPublicRoutes from './modules/public/images/images.routes.js';
import ingresantesPublicRoutes from './modules/public/ingresantes/ingresantes.routes.js';
import seccionesPublicasRoutes from './modules/public/secciones/secciones.routes.js';
import navegacionPublicaRoutes from './modules/public/navegacion/navegacion.routes.js';
import eventsRoutes from './modules/public/events/events.routes.js';

// Rutas de administración y autenticación
import authRoutes from './modules/auth/auth.routes.js';
import imagenesRoutes from './modules/admin/imagenes/imagenes.routes.js';
import ingresantesRoutes from './modules/admin/ingresantes/ingresantes.routes.js';
import adminCatalogosRoutes from './modules/admin/catalogos/catalogos.routes.js';
import adminSolicitudesRoutes from './modules/admin/solicitudes/solicitudes.routes.js';
import adminPlantillasRoutes from './modules/admin/plantillas/plantillas.routes.js';
import seccionesRoutes from './modules/admin/secciones/secciones.routes.js';
import navegacionRoutes from './modules/admin/navegacion/navegacion.routes.js';
import auditoriaRoutes from './modules/admin/auditoria/auditoria.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* Seguridades, logs y middlewares base */
app.use(helmet());
app.use(cors({ origin: env.corsOrigins || '*' }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

/* Parsing con límite de tamaño */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

/* Archivos estáticos */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* Rutas públicas */
app.use('/api/v1/solicitudes/informacion', solicitudInfoRoutes);
app.use('/api/v1/solicitudes/matricula', solicitudMatriculaRoutes);
app.use('/api/v1/catalogos', catalogosRoutes);
app.use('/api/v1/public/imagenes', imagenesPublicRoutes);
app.use('/api/v1/public/ingresantes', ingresantesPublicRoutes);
app.use('/api/v1/public/secciones', seccionesPublicasRoutes);
app.use('/api/v1/public/navegacion', navegacionPublicaRoutes);
app.use('/api/v1/public/events', eventsRoutes);

/* Rutas de administración y autenticación */
app.use('/api/v1/admin/auth', authRoutes);
app.use('/api/v1/admin/solicitudes', adminSolicitudesRoutes);
app.use('/api/v1/admin/catalogos', authMiddleware, adminCatalogosRoutes);
app.use('/api/v1/admin/plantillas', adminPlantillasRoutes);
app.use('/api/v1/admin/imagenes', imagenesRoutes);
app.use('/api/v1/admin/ingresantes', ingresantesRoutes);
app.use('/api/v1/admin/secciones', seccionesRoutes);
app.use('/api/v1/admin/navegacion', navegacionRoutes);
app.use('/api/v1/admin/auditoria', auditoriaRoutes);

/* Manejo de 404 y errores (al final) */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;