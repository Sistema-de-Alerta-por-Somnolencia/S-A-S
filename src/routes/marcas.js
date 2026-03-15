// Importa express
import express from "express";

// Importa conexión a la base de datos
import pool from "../db/connection.js";

// Crea router
const router = express.Router();


/*
---------------------------------------
OBTENER TODAS LAS MARCAS
---------------------------------------
GET /marcas
*/

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM marcas_vehiculo ORDER BY id_marca"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener marcas"
    });

  }

});


/*
---------------------------------------
CREAR UNA MARCA
---------------------------------------
POST /marcas
*/

router.post("/", async (req, res) => {

  try {

    const { nombre_marca } = req.body;

    const result = await pool.query(

      `INSERT INTO marcas_vehiculo (nombre_marca)
       VALUES ($1)
       RETURNING *`,

      [nombre_marca]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear marca"
    });

  }

});

export default router;