const db = require("../database/db");

const listarUsuarios = (req, res) => {

    db.all(

        `SELECT
        id,
        nombre,
        rol
        FROM usuarios
        ORDER BY nombre`,

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    mensaje: "Error"
                });

            }

            res.json(rows);

        }

    );

};

const eliminarUsuario = (req, res) => {

    const { id } = req.params;

    // 🚨 NO permitir auto-eliminación
    if (req.usuario.id == id) {
        return res.status(400).json({
            mensaje: "No puedes eliminar tu propio usuario"
        });
    }

    db.run(
        "DELETE FROM usuarios WHERE id=?",
        [id],
        function (err) {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error al eliminar"
                });
            }

            res.json({
                mensaje: "Usuario eliminado"
            });

        }
    );
};

module.exports = { listarUsuarios, eliminarUsuario };
