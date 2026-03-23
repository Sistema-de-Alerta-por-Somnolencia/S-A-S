import { Router } from 'express';
import { getMarcas, createMarca, getModelos, createModelo, getUnidades, createUnidad, getUnidadesChofer } from '../controllers/flotaController.js';

const router = Router();


// Rutas 
router.get("/marcas", getMarcas);
router.post("/marcas", createMarca);

router.get("/modelos", getModelos);
router.post("/modelos", createModelo);

router.get("/unidades", getUnidades);
router.post("/unidades", createUnidad);

// Esta es la ruta específica que usará el principal.html
router.get("/unidades-chofer", getUnidadesChofer);

export default router;