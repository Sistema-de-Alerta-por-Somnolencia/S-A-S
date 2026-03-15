import { query } from '../db/pool.js';

import bcrypt, { hash } from 'bcrypt'


if (query) {
    console.log("Query cargada correctamente desde el pool");
}

export const getAdmin = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, email, password } = req.body

    try {
        const text = "SELECT nombre, apellido_paterno, apellido_materno, email FROM administradores where email = $1";
        const param = [nombre, apellido_paterno, apellido_materno, email];
        const result = await query[text, params]
        // si no se encuentra la credencial
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales invalidad' });
        }
        const user = result.rows[0]
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Error comparando contraseña y hash")
            return res.status(401).json({ error: 'Password Incorrecto' });
        }
        return res.status(200).json({
            message: 'Login exitoso',
            userName: user.nombre,
            userEmail: user.email
        });
    } catch (err) {

        console.error("Error al traer los datos del Administrador", error.stack);
        res.status(500).json({
            error: "Error al obtener administradores"
        });

    }
};



/*
CREAR ADMINISTRADOR
*/
export const registerAdmin = async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, email, password } = req.body

    if (!nombre || !apellido_paterno || !apellido_materno || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    try {
        const saltRound = 10;

        const hashPassword = await bcrypt.hash(password, saltRound);

        const text = `INSERT INTO administradores
        (nombre,apellido_paterno,apellido_materno,email,password)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *`;
        const params = [nombre, apellido_paterno, apellido_materno, email, hashPassword];

        const result = await query(text, params);
        console.log(text)


        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'Registro exitoso. El nuevo usuario ha sido agregado a la base de datos.',
            userID: newUser.id,
            userEmail: newUser.email
        });

    } catch (err) {
        // violacion de restriccion UNIQUE para correo
        if (err.code === '23505') { // codigo de error de PostgreSQL para violacion de UNIQUE constraint
            return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
        }

        console.error("Error durante el registro:", err.stack);
        return res.status(500).json({
            error: 'Error interno del servidor al intentar registrar el usuario.'
        });
    }
}

