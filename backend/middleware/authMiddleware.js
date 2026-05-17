const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {

    const auth = req.headers.authorization;

    if (!auth) {

        return res.status(401).json({
            mensaje: "Token requerido"
        });

    }

    const token = auth.split(" ")[1];

    try {

        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();

    } catch {

        return res.status(403).json({
            mensaje: "Token inválido"
        });

    }

};

module.exports = verificarToken;