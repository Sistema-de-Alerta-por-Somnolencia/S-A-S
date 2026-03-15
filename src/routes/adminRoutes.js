import { Router } from "express";
import { registerAdmin, getAdmin } from "../controllers/adminController.js";

const router = Router();

// Cuando  se cree un nuedo admin

router.post('/registerAdmin', registerAdmin)

// esta madre se usa cuando corroborar un nuevo admin
router.post('/getAdmin', getAdmin)

export default router