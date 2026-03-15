import { spawn } from 'child_process';

export const ejecutarScriptPython = () => {
    return new Promise((resolve, reject) => {

        //  Detectamos si es Windows
        const isWindows = process.platform === 'win32';

        // Asignamos la ruta dependiendo del sistema operativo
        const pythonPath = isWindows ? './venv/Scripts/python.exe' : './.venv/bin/python';

        const scriptPath = './src/python/vision-dormido.py';

        const pythonProcess = spawn(pythonPath, [scriptPath]);
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