const db = require("../database/db");

const listarAuditoria = (req, res) => {

    db.all(
        `SELECT * 
        FROM auditoria
        ORDER BY fecha DESC`,
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
    listarAuditoria
};