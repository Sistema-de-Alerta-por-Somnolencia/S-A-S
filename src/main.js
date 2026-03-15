import express from 'express';
import path from 'path';
import cors from 'cors'; // NUEVO (Diego): Importa CORS para permitir peticiones desde otros dominios
import { fileURLToPath } from 'url';

// Recreamos __filename y __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
const PORT = process.env.PORT || 3000;


import { ejecutarScriptPython } from './python/pythonApi.js';

import apiRoutes from './routes/index.js';

// ... configuraciones ...

app.use('/api', apiRoutes);

// NUEVO (Diego): Importa las rutas donde se van a encontrar los json
import marcasRoutes from "./routes/marcas.js";
import modelosRoutes from "./routes/modelos.js";
import choferesRoutes from "./routes/choferes.js";
import administradoresRoutes from "./routes/administradores.js";
import unidadesRoutes from "./routes/unidades.js";
import tiposAlertasRoutes from "./routes/tipos_alerta.js";
import alertasRoutes from "./routes/alertas_db.js";


// Esta madre se descomenta antes de la presentacion loko

/*

const iniciarApp = async () => {
  console.log("Iniciando sistema...");

  try {
    console.log("Llamando a Python...");
    // Esperamos a que Python termine y nos devuelva el texto
    const respuestaPython = await ejecutarScriptPython();

    console.log("¡Éxito! Python dice:", respuestaPython);

    // Aqui mandamos respuesta al dom

  } catch (error) {
    console.error("Hubo un problema al ejecutar Python:", error);
  }
};

iniciarApp();
*/

// NUEVO (Diego): Habilita CORS (permite que el frontend acceda a la API)
app.use(cors());

// asi tendremos un middleware
app.use(express.json())

// NUEVO (Diego): Registra las rutas de la base de datos (Ej: http://localhost:3000/api/unidades)
/*
app.use("/api/marcas", marcasRoutes);
app.use("/api/modelos", modelosRoutes);
app.use("/api/choferes", choferesRoutes);
app.use("/api/administradores", administradoresRoutes);
app.use("/api/unidades", unidadesRoutes);
app.use("/api/tipos_alerta", tiposAlertasRoutes);
app.use("/api/alertas_db", alertasRoutes);

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
*/


// NUEVO (Diego): Servidor de archivos estáticos para mi frontend anterior
app.use('/dashboard', express.static(path.join(__dirname, 'public/dashboard')));

app.use(express.static(path.join(__dirname, 'public')));
// Servir archivos estáticos automáticamente y ocultar la extensión .html en la URL
app.use(express.static(path.join(__dirname, 'views'), {
  extensions: ['html']
}));

// Solo necesitas definir la ruta raíz ('/') manualmente

app.get(['/', '/cuentaexistente'], (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'cuentaExistente.html'));
});
app.get('/newcuenta', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'newCuenta.html'));
});
// esta aun no la usare.
app.get('/api/camiones', (req, res) => {
  // Más adelante, aquí harás la consulta a tu base de datos. 
  // Por ahora, devolvemos datos "mockeados" (de prueba).
  const camionesMock = [
    { id: 'TRK-001', chofer: 'Roberto M.', estado: 'activo', velocidad: 83, combustible: 62 },
    { id: 'TRK-002', chofer: 'Ana G.', estado: 'advertencia', velocidad: 110, combustible: 40 },
    { id: 'TRK-004', chofer: 'Luis P.', estado: 'mantenimiento', velocidad: 0, combustible: 10 }
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