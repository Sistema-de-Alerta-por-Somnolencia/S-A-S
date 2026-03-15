// Archivo: src/python/pythonApi.js

// NUEVO (Diego): Se cambió 'require' por 'import' para que sea compatible con "type": "module"
import { spawn } from 'child_process'; 

// NUEVO (Diego): Se agregó 'export' al inicio para que main.js pueda encontrar la función
export const ejecutarScriptPython = () => {
    return new Promise((resolve, reject) => {
        // Rutas (ajusta según tu SO)
        
        // NUEVO (Diego): Se actualizó la ruta al ejecutable de Python para Windows (.\venv\Scripts\python.exe)
        // El original era './.venv/bin/python' (Linux/Mac)
        const pythonPath = './venv/Scripts/python.exe'; 
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

// NUEVO (Diego): Se eliminó 'module.exports' ya que no es compatible con el sistema de módulos actual (import/export)
// La función ya se exporta arriba directamente con 'export const'