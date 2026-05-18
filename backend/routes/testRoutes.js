const express = require("express");

const router = express.Router();

const verificarToken =
    require("../middleware/authMiddleware");

const db = require("../database/db");

router.get(
    "/perfil",
    verificarToken,
    (req, res) => {

        db.get(

            "SELECT id,nombre,correo,rol FROM usuarios WHERE id=?",

            [req.usuario.id],

            (err, user) => {

                if (err || !user) {

                    return res.status(500).json({

                        mensaje: "Error al obtener usuario"

                    });

                }

                res.json({

                    usuario: user

                });

            }

        );

    });

module.exports = router;