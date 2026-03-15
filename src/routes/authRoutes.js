
import { Router } from 'express';
import { login, register } from '../controllers/loginController.js';

const router = Router();

// Cuando hagan un POST a /register, ejecuta la función register de tu controlador
router.post('/register', register);

// De una vez dejamos lista la ruta para el login
router.post('/login', login);

export default router;