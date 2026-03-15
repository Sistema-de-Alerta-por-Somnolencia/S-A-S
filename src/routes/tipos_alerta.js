// Importa express para crear rutas
import express from "express";

// Importa la conexión a PostgreSQL
import pool from "../db/connection.js";

// Crea el router
const router = express.Router();


/*
---------------------------------------------------
OBTENER TODOS LOS TIPOS DE ALERTA
---------------------------------------------------
GET http://localhost:3000/tipos_alerta
*/

router.get("/", async (req, res) => {

  try {

    // Consulta SQL para obtener todos los registros
    const result = await pool.query(
      "SELECT * FROM tipos_alerta ORDER BY id_tipo_alerta"
    );

    // Devuelve los resultados en formato JSON
    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener tipos de alerta"
    });

  }

});


/*
---------------------------------------------------
OBTENER UN TIPO DE ALERTA POR ID
---------------------------------------------------
GET http://localhost:3000/tipos_alerta/1
*/

router.get("/:id", async (req, res) => {

  try {

    // Obtiene el id desde la URL
    const { id } = req.params;

    // Consulta SQL usando parámetro seguro
    const result = await pool.query(
      "SELECT * FROM tipos_alerta WHERE id_tipo_alerta = $1",
      [id]
    );

    // Si no existe ese registro
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Tipo de alerta no encontrado"
      });
    }

    // Devuelve el registro encontrado
    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al obtener el tipo de alerta"
    });

  }

});


/*
---------------------------------------------------
CREAR UN NUEVO TIPO DE ALERTA
---------------------------------------------------
POST http://localhost:3000/tipos_alerta
*/

router.post("/", async (req, res) => {

  try {

    // Obtiene el dato enviado desde el frontend
    const { nombre_alerta } = req.body;

    // Inserta el nuevo registro
    const result = await pool.query(

      `INSERT INTO tipos_alerta (nombre_alerta)
       VALUES ($1)
       RETURNING *`,

      [nombre_alerta]

    );

    // Devuelve el registro creado
    res.status(201).json({
      mensaje: "Tipo de alerta creado",
      tipo_alerta: result.rows[0]
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al crear tipo de alerta"
    });

  }

});


// Exporta el router para usarlo en server.js
export default router;