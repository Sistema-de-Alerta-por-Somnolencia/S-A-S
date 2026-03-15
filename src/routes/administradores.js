import express from "express";
import pool from "../db/connection.js";

const router = express.Router();


/*
OBTENER ADMINISTRADORES
*/

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM administradores"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener administradores"
    });

  }

});


/*
CREAR ADMINISTRADOR
*/

router.post("/", async (req, res) => {

  try {

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      email,
      password
    } = req.body;

    const result = await pool.query(

      `INSERT INTO administradores
      (nombre,apellido_paterno,apellido_materno,email,password)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,

      [
        nombre,
        apellido_paterno,
        apellido_materno,
        email,
        password
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear administrador"
    });

  }

});

export default router;