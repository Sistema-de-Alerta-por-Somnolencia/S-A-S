import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRouter from './adminRoutes.js';
import choferesRoutes from './choferesRoutes.js';
import flotaRoutes from './flotaRoutes.js';
import alertasRoutes from './alertasRoutes.js';



// Importamos el cadenero de API
import { verificarSesionAPI } from '../middlewares/authMiddleware.js';

const router = Router();


// No requiere sesion
router.use('/auth', authRoutes);
router.use('/admin', adminRouter);


// ZONA PRIVADA (Requiere sesión para ver camiones, alertas y choferes)
// ahora estas apis te piden que tu sesion este iniciada para usarse, que tal jejeje melapelas
router.use('/choferes', verificarSesionAPI, choferesRoutes);
router.use('/flota', verificarSesionAPI, flotaRoutes);
router.use('/alertas', verificarSesionAPI, alertasRoutes);


export default router;