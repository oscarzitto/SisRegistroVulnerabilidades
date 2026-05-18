const db = require("../database/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({
            mensaje: "Faltan campos"
        });
    }

    try {

        const hash = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO usuarios
        (nombre,correo,password_hash,rol)
        VALUES(?,?,?,?)`,
            [nombre, correo, hash, rol],

            function (err) {

                if (err) {

                    return res.status(500).json({
                        mensaje: "Error al registrar"
                    });
                }

                res.json({
                    mensaje: "Usuario creado"
                });

            });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error"
        });

    }

};

const login = (req, res) => {

    const { correo, password } = req.body;

    db.get(
        "SELECT * FROM usuarios WHERE correo=?",
        [correo],

        async (err, usuario) => {

            if (err || !usuario) {

                return res.status(401).json({
                    mensaje: "Usuario no encontrado"
                });

            }

            const valido = await bcrypt.compare(
                password,
                usuario.password_hash
            );

            if (!valido) {

                return res.status(401).json({
                    mensaje: "Contraseña incorrecta"
                });

            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "1h"
                });

            db.run(
                `INSERT INTO auditoria
                    (
                    usuario,
                    evento,
                    fecha
                    )

                    VALUES(?,?,datetime('now'))`,

                [
                    usuario.nombre,
                    "Inicio sesión"
                ]

            );

            res.json({
                mensaje: "Login correcto",
                token
            });

        });

};

const logout = (req, res) => {

    db.run(
        `INSERT INTO auditoria
        (usuario, evento, fecha)
        VALUES (?, ?, datetime('now'))`,
        [
            req.usuario.nombre,
            "Cierre sesión"
        ]
    );

    res.json({
        mensaje: "Logout registrado"
    });

};

module.exports = { register, login, logout };