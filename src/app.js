import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from './config/env.js';

import solicitudInfoRoutes from './modules/public/solicitudes-info/solicitudes-info.routes.js';
import solicitudMatriculaRoutes from './modules/public/solicitudes-matricula/solicitudes-matricula.routes.js';
import catalogosRoutes from './modules/public/catalogos/catalogos.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import adminCatalogosRoutes from './modules/admin/catalogos/catalogos.routes.js';
import adminSolicitudesRoutes from './modules/admin/solicitudes/solicitudes.routes.js';
import adminPlantillasRoutes from './modules/admin/plantillas/plantillas.routes.js';
import { authMiddleware } from './shared/auth.middleware.js';
import { notFoundHandler, errorHandler } from './shared/error-handler.js';

const app = express();

/* Seguridad y logging */
app.use(helmet());
app.use(cors({
  origin: env.corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

/* Parsing con límite de tamaño */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

/* Público */
app.use('/api/v1/solicitudes/informacion', solicitudInfoRoutes);
app.use('/api/v1/solicitudes/matricula', solicitudMatriculaRoutes);
app.use('/api/v1/catalogos', catalogosRoutes);
app.use('/api/v1/admin/auth', authRoutes);

/* Admin (protegido) */
app.use('/api/v1/admin/solicitudes', adminSolicitudesRoutes);
app.use('/api/v1/admin/catalogos', authMiddleware, adminCatalogosRoutes);
app.use('/api/v1/admin/plantillas', adminPlantillasRoutes);

/* 404 y errores (siempre al final) */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
