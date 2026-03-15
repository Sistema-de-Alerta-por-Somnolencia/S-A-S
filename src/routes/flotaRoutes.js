import { query } from '../db/pool.js';
import { Router } from "express";

const router = Router();

export const getChoferes = async (req, res) => {
    try {
        const result = await query("SELECT * FROM choferes ORDER BY id_chofer");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener choferes" });
    }
};

export const createChofer = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, licencia, telefono, email } = req.body;
        const result = await query(
            `INSERT INTO choferes (nombre,apellido_paterno,apellido_materno,licencia,telefono,email) 
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, licencia, telefono, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar chofer" });
    }
};


export default router;