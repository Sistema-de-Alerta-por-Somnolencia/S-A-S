import { Router } from "express";
import { 
    getUnidades, createUnidad, updateUnidad, deleteUnidad,
    getMarcas, createMarca, 
    getModelos, createModelo
} from "../controllers/unidadesController.js";

const router = Router();

router.get("/", getUnidades);
router.post("/", createUnidad);
router.put("/:id", updateUnidad);   // Para editar
router.delete("/:id", deleteUnidad); // Para eliminar

// Marcas
router.get("/marcas", getMarcas);
router.post("/marcas", createMarca);

// Modelos
router.get("/modelos", getModelos);
router.post("/modelos", createModelo);



export default router;