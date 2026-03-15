import { Pool } from 'pg'
import dotenv from 'dotenv';
dotenv.config();




const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})

export const query = (text, params) => {
    console.log("ejecutando query", text, params)
    return pool.query(text, params)
}

export const getClient = () => {
    return pool.connect()
}

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error conectando a PostgreSQL. Revisa tu archivo .env:', err.stack);
    } else {
        console.log('✅ ¡Conexión exitosa a PostgreSQL! Hora de la BD:', res.rows[0].now);
    }
});