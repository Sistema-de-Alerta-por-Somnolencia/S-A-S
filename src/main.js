import express from 'express';
import path from 'path';
import cors from 'cors'; // NUEVO (Diego): Importa CORS para permitir peticiones desde otros dominios
import { fileURLToPath } from 'url';
import session from 'express-session';

import dotenv from 'dotenv';
dotenv.config();



import { verificarSesionHTML } from './middlewares/authMiddleware.js';



// Recreamos __filename y __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
const PORT = process.env.PORT || 3000;


app.use(session({
  secret: 'secreto_super_seguro_sas', //esto lo pasamos al .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 2 }
  // la formula es 1000 ml * 60 seg * 60 min * 2 hrs, asi se puede modificar
}));


import { ejecutarScriptPython } from './python/pythonApi.js';

import apiRoutes from './routes/index.js';
import viewRoutes from './routes/viewRoutes.js';

// con esto se sirve la llave de maps con seguridad
app.get('/CargarMapa', (req, res) => {
  res.json({ apiKey: process.env.API_KEY_MAPS });
});


// Esta madre se descomenta antes de la presentacion loko



const iniciarApp = async () => {
  console.log("Iniciando sistema...");

  try {
    console.log("Llamando a Python...");

    // ELIMINA EL 'await'. Solo llama a la función.
    // Esto permite que Node siga ejecutando el resto del código sin esperar.
    ejecutarScriptPython()
      .then(res => console.log("Python terminó:", res))
      .catch(err => console.error("Error en Python:", err));

    console.log("¡Cámara iniciada de fondo!");

  } catch (error) {
    console.error("Hubo un problema al ejecutar Python:", error);
  }
};

iniciarApp();


// NUEVO (Diego): Habilita CORS (permite que el frontend acceda a la API)
app.use(cors());

// asi tendremos un middleware
app.use(express.json())


// Todo lo que creaste aqui diego lo pase a Index.js SRP
app.use('/api', apiRoutes);
app.use('/', viewRoutes); // ahora ya puedes poner tus html Diego.



// NUEVO (Diego): Servidor de archivos estáticos para mi frontend anterior
app.use('/dashboard', express.static(path.join(__dirname, 'public/dashboard')));



app.use(express.static(path.join(__dirname, 'public')));






// esta es la api para el maps
app.get('/api/camiones', (req, res) => {
  const camionesMock = [
    { id: 'TRK-001', chofer: 'Roberto M.', estado: 'activo', lat: 19.4326, lng: -99.1332 }, // Centro Histórico
    { id: 'TRK-002', chofer: 'Ana G.', estado: 'advertencia', lat: 19.3553, lng: -99.0622 }, // Iztapalapa
    { id: 'TRK-004', chofer: 'Luis P.', estado: 'mantenimiento', lat: 19.4978, lng: -99.1269 } // Gustavo A. Madero
  ];
  res.json(camionesMock);
});



// Ruta POST para recibir las alertas desde los camiones (o desde Postman)
app.post('/api/alertas', (req, res) => {
  // req.body contiene el JSON que nos manda Postman o Python
  const nuevaAlerta = req.body;

  // Imprimimos en la terminal para confirmar que llego
  console.log('¡NUEVA ALERTA RECIBIDA!');
  console.log(nuevaAlerta);

  // Adelante guardaremos en base de datos o enviaremos el correo.
  // Por ahora, solo le respondemos que todo salio al putazo.

  res.status(200).json({
    status: 'success',
    message: 'Alerta procesada y guardada en el servidor correctamente',
    recibido: nuevaAlerta
  });
});







app.listen(PORT, () => {
  // NUEVO (Diego): Mensaje modificado para confirmar que el servidor levantó con la fusión
  console.log(`Servidor levantado en puerto http://localhost:${PORT}`);
})