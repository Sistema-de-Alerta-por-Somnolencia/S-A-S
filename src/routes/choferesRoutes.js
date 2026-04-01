import { Router } from "express";
import { getChoferes, createChofer, deleteChofer, updateChofer } from "../controllers/choferesController.js";

const router = Router();

router.get("/", getChoferes);
router.post("/", createChofer);

router.put("/:id", updateChofer);    // Nueva ruta para editar
router.delete("/:id", deleteChofer); // Nueva ruta para eliminar

export default router;