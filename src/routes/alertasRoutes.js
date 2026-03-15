import { Router } from "express";
import { getTiposAlerta, getTipoAlertaById, createTipoAlerta, getAlertas, createAlerta } from "../controllers/alertasController.js";

const router = Router();

router.get("/tipos", getTiposAlerta);
router.get("/tipos/:id", getTipoAlertaById);
router.post("/tipos", createTipoAlerta);

router.get("/", getAlertas);
router.post("/", createAlerta);

export default router;