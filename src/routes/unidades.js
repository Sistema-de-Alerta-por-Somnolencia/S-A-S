import express from "express";
import pool from "../db/connection.js";

const router = express.Router();


/*
OBTENER UNIDADES
*/

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM unidades ORDER BY id_unidad"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener unidades"
    });

  }

});


/*
CREAR UNIDAD
*/

router.post("/", async (req, res) => {

  try {

    const {
      placa,
      anio,
      id_chofer,
      id_modelo
    } = req.body;

    const result = await pool.query(

      `INSERT INTO unidades
      (placa,anio,id_chofer,id_modelo)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,

      [
        placa,
        anio,
        id_chofer,
        id_modelo
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al registrar unidad"
    });

  }

});

export default router;