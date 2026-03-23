

// esta madre verifica que ya tengas una sesion iniciada
export const verificarSesionHTML = (req, res, next) => {
    if (req.session.userID) {
        next(); // si si la tienes te carga la pagina
    } else {
        res.redirect('/cuentaExistente'); // si no ps te manda a la verga
    }
};


export const verificarSesionAPI = (req, res, next) => {
    // Si la petición trae nuestra clave secreta, la dejamos pasar, esto para los codigo de py
    if (req.headers['x-api-key'] === 'clave_secreta_camion_123') {
        return next();
    }

    // Si no trae la clave, debe ser usuario, hacemos la verificacion normal.
    if (req.session.userID) {
        next();
    } else {
        res.status(401).json({ error: 'Acceso denegado. Por favor, inicia sesión.' });
    }
};