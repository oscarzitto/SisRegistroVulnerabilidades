const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {

    // Obtiene el header:
    // Authorization: Bearer <token>
    const auth = req.headers.authorization;

    // Si no existe token, bloquea el acceso
    if (!auth) {

        return res.status(401).json({
            mensaje: "Token requerido"
        });

    }

    // Extrae solamente el JWT
    const token = auth.split(" ")[1];

    try {

        // Verifica que el token fue firmado
        // con la clave secreta del servidor
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Permite continuar hacia la ruta
        req.usuario = usuario;

        next();

    } catch {

        // Si el token fue modificado,
        // expiró o es falso, se rechaza
        return res.status(403).json({
            mensaje: "Token inválido"
        });

    }

};

module.exports = verificarToken;