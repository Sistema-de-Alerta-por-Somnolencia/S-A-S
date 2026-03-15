import { query } from '../db/pool.js';

// --- MARCAS ---
export const getMarcas = async (req, res) => {
    try {
        const result = await query("SELECT * FROM marcas_vehiculo ORDER BY id_marca");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener marcas" });
    }
};

export const createMarca = async (req, res) => {
    try {
        const { nombre_marca } = req.body;
        const result = await query(
            `INSERT INTO marcas_vehiculo (nombre_marca) VALUES ($1) RETURNING *`,
            [nombre_marca]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear marca" });
    }
};

// --- MODELOS ---
export const getModelos = async (req, res) => {
    try {
        const result = await query("SELECT * FROM modelos_vehiculo ORDER BY id_modelo");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener modelos" });
    }
};

export const createModelo = async (req, res) => {
    try {
        const { nombre_modelo, id_marca } = req.body;
        const result = await query(
            `INSERT INTO modelos_vehiculo (nombre_modelo, id_marca) VALUES ($1,$2) RETURNING *`,
            [nombre_modelo, id_marca]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear modelo" });
    }
};

// --- UNIDADES ---
export const getUnidades = async (req, res) => {
    try {
        const result = await query("SELECT * FROM unidades ORDER BY id_unidad");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener unidades" });
    }
};

export const createUnidad = async (req, res) => {
    try {
        const { placa, anio, id_chofer, id_modelo } = req.body;
        const result = await query(
            `INSERT INTO unidades (placa,anio,id_chofer,id_modelo) VALUES ($1,$2,$3,$4) RETURNING *`,
            [placa, anio, id_chofer, id_modelo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar unidad" });
    }
};