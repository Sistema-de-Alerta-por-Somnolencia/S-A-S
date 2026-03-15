import express from 'express';
import pool from '../db/connection.js';
const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body;

        // Insertar en la tabla 'administradores'
        const result = await pool.query(
            `INSERT INTO administradores (nombre, apellido_paterno, email, password) 
             VALUES ($1, $2, $3, $4) RETURNING id_admin, nombre`,
            [name, lastname, email, password]
        );

        res.status(201).json({
            message: "Usuario registrado con éxito",
            userID: result.rows[0].id_admin,
            username: result.rows[0].nombre
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar: el email ya existe o faltan datos" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al administrador por email
        const result = await pool.query(
            "SELECT id_admin, nombre, password FROM administradores WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0 || result.rows[0].password !== password) {
            return res.status(401).json({ error: "Credenciales incorrectas" });
        }

        res.json({
            userID: result.rows[0].id_admin,
            username: result.rows[0].nombre
        });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

export default router;