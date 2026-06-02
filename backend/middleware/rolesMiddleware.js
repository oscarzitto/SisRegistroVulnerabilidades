function verificarRol(...rolesPermitidos) {

    return (req, res, next) => {

        // Verifica si el rol almacenado en el JWT
        // tiene permiso para acceder a esta ruta
        if (
            !rolesPermitidos.includes(
                req.usuario.rol
            )
        ) {

            return res.status(403).json({

                mensaje: "Sin permisos"

            });

        }

        // El usuario tiene el rol requerido
        next();

    };

}

module.exports = verificarRol;