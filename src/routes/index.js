


import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRouter from './adminRoutes.js';
import choferesRoutes from './choferesRoutes.js';
import flotaRoutes from './flotaRoutes.js';
import alertasRoutes from './alertasRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRouter);
router.use('/choferes', choferesRoutes);
router.use('/flota', flotaRoutes);       // Agrupa /api/flota/marcas, /api/flota/unidades, etc.
router.use('/alertas', alertasRoutes);   // Agrupa /api/alertas/ y /api/alertas/tipos

export default router;