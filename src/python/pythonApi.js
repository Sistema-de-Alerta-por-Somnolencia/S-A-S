// Archivo: services/pythonRunner.js
const { spawn } = require('child_process');

const ejecutarScriptPython = () => {
    return new Promise((resolve, reject) => {
        // Rutas (ajusta según tu SO)
        const pythonPath = './.venv/bin/python';
        const scriptPath = './src/python/vision-dormido.py';


        const pythonProcess = spawn(pythonPath, [scriptPath]);
        let resultado = '';

        // Capturar los datos (stdout)
        pythonProcess.stdout.on('data', (data) => {
            resultado += data.toString();
        });

        // Capturar errores (stderr)
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error en Python: ${data.toString()}`);
        });

        // Resolver o rechazar la promesa cuando termine
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(resultado); // Todo salió bien
            } else {
                reject(new Error(`El script de Python fallo con código ${code}`));
            }
        });
    });
};

// Exportamos la función para poder usarla en otro lado
module.exports = { ejecutarScriptPython };