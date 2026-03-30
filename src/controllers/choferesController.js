import { query } from '../db/pool.js';

export const getChoferes = async (req, res) => {
    try {
        const result = await query("SELECT * FROM choferes ORDER BY id_chofer");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener choferes" });
    }
};

export const createChofer = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, licencia, telefono, email} = req.body;
        
        const result = await query(
            `INSERT INTO choferes (nombre, apellido_paterno, apellido_materno, licencia, telefono, email) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, licencia, telefono, email] 
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar chofer" });
    }
};

export const updateChofer = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido_paterno, apellido_materno, licencia, telefono, email } = req.body;
        
        const result = await query(
            `UPDATE choferes SET nombre=$1, apellido_paterno=$2, apellido_materno=$3, 
             licencia=$4, telefono=$5, email=$6 WHERE id_chofer=$7 RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, licencia, telefono, email, id]
        );
        
        if (result.rows.length === 0) return res.status(404).json({ error: "Chofer no encontrado" });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar chofer" });
    }
};

export const deleteChofer = async (req, res) => {
    try {
        const { id } = req.params;
        // Ejecutamos la eliminación
        const result = await query("DELETE FROM choferes WHERE id_chofer = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Chofer no encontrado" });
        }

        // Enviamos un status 200 y un mensaje de éxito
        return res.status(200).json({ 
            message: "Chofer eliminado correctamente", 
            deleted: result.rows[0] 
        });
    } catch (error) {
        console.error("Error en deleteChofer:", error);
        res.status(500).json({ error: "Error al eliminar chofer" });
    }
};