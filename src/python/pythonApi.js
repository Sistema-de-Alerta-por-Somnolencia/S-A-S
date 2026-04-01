import { spawn } from 'child_process';

export const ejecutarScriptPython = () => {
    return new Promise((resolve, reject) => {

        // 1. Priorizamos la ruta del .env, si no, usamos la lógica por defecto
        const pythonPath = process.env.PYTHON_PATH || 
                           (process.platform === 'win32' ? './venv/Scripts/python.exe' : './.venv/bin/python');

        const scriptPath = './src/python/main_vision.py';

        // Log para que veas en consola qué Python está usando realmente
        console.log(`Usando intérprete de Python en: ${pythonPath}`);

        const pythonProcess = spawn(pythonPath, [scriptPath], {
            env: { 
                ...process.env,
                DISPLAY: process.env.DISPLAY || ':0', // Fuerza a Python a buscar tu monitor
                PYTHONUNBUFFERED: '1' // Ayuda a que los logs lleguen en tiempo real
            }
        });
        
        let resultado = '';

        pythonProcess.stdout.on('data', (data) => {
            resultado += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error en Python: ${data.toString()}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(resultado);
            } else {
                reject(new Error(`El script de Python fallo con código ${code}`));
            }
        });
    });
};