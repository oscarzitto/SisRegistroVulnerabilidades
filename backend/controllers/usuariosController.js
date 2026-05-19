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

module.exports = {
    listarUsuarios
};