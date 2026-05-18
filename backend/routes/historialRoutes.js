const express = require("express");
const router = express.Router();

const db = require("../database/db");
const verificarToken = require("../middleware/authMiddleware");

// ver historial completo
router.get("/", verificarToken, (req, res) => {

    db.all(
        `SELECT * FROM historial ORDER BY fecha DESC`,
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error al obtener historial"
                });
            }

            res.json(rows);
        }
    );

});

module.exports = router;