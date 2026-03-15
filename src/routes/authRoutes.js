
import { Router } from 'express';
import { login, register } from '../controllers/loginController.js';

const router = Router();

// Cuando creas nueva cuenta
router.post('/register', register);

// aqui escucha esta madre cuando ingresamos a nuestra cuenta
router.post('/login', login);

export default router;