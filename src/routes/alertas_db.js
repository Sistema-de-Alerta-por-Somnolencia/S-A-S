import express from "express";
import pool from "../db/connection.js";

const router = express.Router();

/* Obtener todas las alertas */

router.get("/", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM alertas");

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener alertas"
    });

  }
});


/* Crear una alerta */

router.post("/", async (req, res) => {

  try {

    const { id_tipo_alerta, id_unidad } = req.body;

    const result = await pool.query(
      `INSERT INTO alertas (id_tipo_alerta, id_unidad)
       VALUES ($1, $2)
       RETURNING *`,
      [id_tipo_alerta, id_unidad]
    );

    res.status(201).json({
      mensaje: "Alerta registrada",
      alerta: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al registrar alerta"
    });

  }

});

export default router;