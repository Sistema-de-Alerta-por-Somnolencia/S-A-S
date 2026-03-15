import express from "express";
import pool from "../db/connection.js";

const router = express.Router();


/*
OBTENER CHOFERES
*/

router.get("/", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM choferes ORDER BY id_chofer"
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener choferes"
    });

  }

});


/*
CREAR CHOFER
*/

router.post("/", async (req, res) => {

  try {

    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      licencia,
      telefono,
      email
    } = req.body;

    const result = await pool.query(

      `INSERT INTO choferes
      (nombre,apellido_paterno,apellido_materno,licencia,telefono,email)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,

      [
        nombre,
        apellido_paterno,
        apellido_materno,
        licencia,
        telefono,
        email
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al registrar chofer"
    });

  }

});

export default router;