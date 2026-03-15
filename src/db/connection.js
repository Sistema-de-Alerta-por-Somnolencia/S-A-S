// Importa la librería "pg" que permite conectar Node.js con PostgreSQL
import pkg from "pg";

// Importa dotenv para poder leer variables de entorno desde el archivo .env
import dotenv from "dotenv";


// Carga las variables del archivo .env al entorno del programa
// Esto permite usar process.env.DB_HOST, DB_USER, etc.
dotenv.config();


// Extrae el objeto Pool de la librería pg
// Pool permite manejar varias conexiones a la base de datos de forma eficiente
const { Pool } = pkg;


// Se crea una instancia del pool de conexiones
// Aquí se configura cómo conectarse a PostgreSQL
const pool = new Pool({

  // Dirección del servidor de la base de datos
  // Ejemplo: localhost
  host: process.env.DB_HOST,

  // Puerto donde corre PostgreSQL
  // Por defecto PostgreSQL usa el puerto 5432
  port: process.env.DB_PORT,

  // Usuario de la base de datos
  user: process.env.DB_USER,

  // Contraseña del usuario
  password: process.env.DB_PASSWORD,

  // Nombre de la base de datos que se va a usar
  database: process.env.DB_NAME
});


// Exporta el pool de conexiones para poder usarlo en otras partes del proyecto
// Por ejemplo en las rutas (routes) para hacer consultas SQL
export default pool;