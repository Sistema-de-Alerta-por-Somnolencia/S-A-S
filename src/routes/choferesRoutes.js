import { Router } from "express";
import { getChoferes, createChofer } from "../controllers/choferesController.js";

const router = Router();

router.get("/", getChoferes);
router.post("/", createChofer);

export default router;