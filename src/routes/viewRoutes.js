import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { verificarSesionHTML } from '../middlewares/authMiddleware.js';

// Recreamos __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Como este archivo está dentro de 'routes', subimos un nivel ('..') para llegar a 'views'
const viewsPath = path.join(__dirname, '../views');

const router = Router();

// --- RUTAS PÚBLICAS ---
router.get(['/', '/cuentaexistente'], (req, res) => {
    res.sendFile(path.join(viewsPath, 'cuentaExistente.html'));
});

router.get('/newcuenta', (req, res) => {
    res.sendFile(path.join(viewsPath, 'newCuenta.html'));
});


// --- RUTAS PRIVADAS (Protegidas por sesión) ---
router.get('/principal', verificarSesionHTML, (req, res) => {
    res.sendFile(path.join(viewsPath, 'principal.html'));
});

// Tu nueva ruta para choferes
router.get('/choferes', verificarSesionHTML, (req, res) => {
    res.sendFile(path.join(viewsPath, 'choferes.html'));
});

router.get('/MapaEnvivo', verificarSesionHTML, (req, res) => {
    res.sendFile(path.join(viewsPath, 'MapaEnVivo.html'));
});



// Si después agregas 'flota.html', solo lo metes aquí
// router.get('/flota', verificarSesionHTML, ...);
router.get('/unidades', verificarSesionHTML, (req, res) => {
    res.sendFile(path.join(viewsPath, 'unidades.html'));
});



export default router;