import express from "express";
import pool from "../db/connection.js";

const router = express.Router();


/*
OBTENER MODELOS
*/

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(

      `SELECT *
       FROM modelos_vehiculo
       ORDER BY id_modelo`

    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener modelos"
    });

  }

});


/*
CREAR MODELO
*/

router.post("/", async (req, res) => {

  try {

    const { nombre_modelo, id_marca } = req.body;

    const result = await pool.query(

      `INSERT INTO modelos_vehiculo
       (nombre_modelo, id_marca)
       VALUES ($1,$2)
       RETURNING *`,

      [nombre_modelo, id_marca]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear modelo"
    });

  }

});

export default router;