import { query } from '../db/pool.js';

// --- GESTIÓN DE UNIDADES ---
export const getUnidades = async (req, res) => {
    try {
        // Usamos JOIN para traer los nombres de marca y modelo en una sola consulta
        const result = await query(`
            SELECT u.id_unidad, u.placa, m.nombre_modelo, ma.nombre_marca, u.id_modelo
            FROM unidades u
            JOIN modelos_vehiculo m ON u.id_modelo = m.id_modelo
            JOIN marcas_vehiculo ma ON m.id_marca = ma.id_marca
            ORDER BY u.id_unidad ASC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener unidades" });
    }
};

export const createUnidad = async (req, res) => {
    const { placa, id_modelo } = req.body;
    try {
        const result = await query(
            "INSERT INTO unidades (placa, id_modelo) VALUES ($1, $2) RETURNING *",
            [placa, id_modelo]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar unidad" });
    }
};

export const updateUnidad = async (req, res) => {
    const { id } = req.params;
    const { placa, id_modelo } = req.body;
    try {
        const result = await query(
            "UPDATE unidades SET placa=$1, id_modelo=$2 WHERE id_unidad=$3 RETURNING *",
            [placa, id_modelo, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar unidad" });
    }
};

export const deleteUnidad = async (req, res) => {
    const { id } = req.params;
    try {
        await query("DELETE FROM unidades WHERE id_unidad = $1", [id]);
        res.json({ message: "Unidad eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar unidad" });
    }
};

// --- GESTIÓN DE MARCAS ---
export const getMarcas = async (req, res) => {
    try {
        const result = await query("SELECT * FROM marcas_vehiculo ORDER BY nombre_marca ASC");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener marcas" });
    }
};

export const createMarca = async (req, res) => {
    const { nombre_marca } = req.body;
    console.log("Datos recibidos en el servidor:", req.body); 
    try {
        if (!nombre_marca) {
            return res.status(400).json({ error: "El nombre de la marca es obligatorio" });
        }
        const result = await query(
            "INSERT INTO marcas_vehiculo (nombre_marca) VALUES ($1) RETURNING *", 
            [nombre_marca]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error SQL:", error);
        res.status(500).json({ error: "Error al crear marca en la base de datos" });
    }
};

// --- GESTIÓN DE MODELOS ---
export const getModelos = async (req, res) => {
    try {
        const result = await query(`
            SELECT m.id_modelo, m.nombre_modelo, m.id_marca, ma.nombre_marca 
            FROM modelos_vehiculo m 
            JOIN marcas_vehiculo ma ON m.id_marca = ma.id_marca 
            ORDER BY ma.nombre_marca, m.nombre_modelo`);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener modelos" });
    }
};

export const createModelo = async (req, res) => {
    const { nombre_modelo, id_marca } = req.body;
    try {
        const result = await query("INSERT INTO modelos_vehiculo (nombre_modelo, id_marca) VALUES ($1, $2) RETURNING *", [nombre_modelo, id_marca]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al crear modelo" });
    }
};
