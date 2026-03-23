import { query } from '../db/pool.js';

// --- TIPOS DE ALERTA ---
export const getTiposAlerta = async (req, res) => {
    try {
        const result = await query("SELECT * FROM tipos_alerta ORDER BY id_tipo_alerta");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener tipos de alerta" });
    }
};

export const getTipoAlertaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await query("SELECT * FROM tipos_alerta WHERE id_tipo_alerta = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Tipo de alerta no encontrado" });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el tipo de alerta" });
    }
};

export const createTipoAlerta = async (req, res) => {
    try {
        const { nombre_alerta } = req.body;
        const result = await query(
            `INSERT INTO tipos_alerta (nombre_alerta) VALUES ($1) RETURNING *`,
            [nombre_alerta]
        );
        res.status(201).json({ mensaje: "Tipo de alerta creado", tipo_alerta: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear tipo de alerta" });
    }
};

// --- ALERTAS ---
export const getAlertas = async (req, res) => {
    try {
        const result = await query("SELECT * FROM alertas ORDER BY id DESC LIMIT 5");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener alertas" });
    }
};

export const createAlerta = async (req, res) => {
    try {
        const { id_tipo_alerta, id_unidad } = req.body;
        const result = await query(
            `INSERT INTO alertas (id_tipo_alerta, id_unidad) VALUES ($1, $2) RETURNING *`,
            [id_tipo_alerta, id_unidad]
        );
        res.status(201).json({ mensaje: "Alerta registrada", alerta: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar alerta" });
    }
};