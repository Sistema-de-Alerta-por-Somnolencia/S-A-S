
import { query } from '/Users/bakaa/Documents/PIS 2/Proyecto final/webVisualizacion/src/db/pool.js';

if (query) {
    console.log("Query cargada correctamente del pool")
}
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const text = 'SELECT id, email FROM usuarios WHERE email = $1 AND password = $2';
        const params = [email, password];

        const result = await query(text, params)

        //si no encontramos las credenciales
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales invalidas' });

        }
        else {
            const user = result.rows[0]
            return res.status(200).json({
                message: 'Login exitoso',
                userID: user.id,
                username: user.email
            })
        }
    } catch (err) {
        console.error("Error durante el login", err.stack); // Usar console.error

        return res.status(500).json({
            error: 'Error interno del servidor '
        });
    }

};

export const register = async (req, res) => {

    const { name, lastname, email, password } = req.body;


    if (!name || !lastname || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios para el registro.' });
    }

    try {

        const text = `
            INSERT INTO credentials (name, lastname, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email; 
        `;
        // crear el array de parámetros
        const params = [name, lastname, email, password];

        // ejecutar la consulta
        const result = await query(text, params);

        // la insercion fue exitosa. retornamos los datos del nuevo usuario.
        // asumiendo que RETURNING devolvio una fila (rows[0])
        const newUser = result.rows[0];

        return res.status(201).json({
            message: 'Registro exitoso. El nuevo usuario ha sido agregado a la base de datos.',
            userID: newUser.id,
            username: newUser.email
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
};