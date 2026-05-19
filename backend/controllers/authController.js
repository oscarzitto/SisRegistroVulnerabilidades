const db = require("../database/db");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    let {
        nombre,
        password,
        rol
    } = req.body;

    // limpiar espacios extra
    nombre = nombre.trim();

    // obtener solo primer nombre
    let nombreBase =
        nombre
            .split(" ")[0]
            .toLowerCase();

    let dominio =
        `${rol}.cl`;

    let correo =
        `${nombreBase}@${dominio}`;

    // buscar correos repetidos
    db.all(

        `SELECT correo
        FROM usuarios
        WHERE correo LIKE ?`,

        [`${nombreBase}%@${dominio}`],

        async (err, rows) => {

            if (err) {

                return res.status(500).json({
                    mensaje: "Error"
                });

            }

            // si existen correos repetidos
            if (rows.length > 0) {

                correo =
                    `${nombreBase}${rows.length}@${dominio}`;

            }

            const hash =
                await bcrypt.hash(
                    password,
                    10
                );

            db.run(
                `INSERT INTO usuarios
                (nombre,correo,password_hash,rol)
                VALUES(?,?,?,?)`,
                [nombre, correo, hash, rol],

                function (err) {

                    if (err) {

                        // 👇 ESTE ES EL ERROR DE DUPLICADO
                        if (err.message.includes("UNIQUE")) {
                            return res.status(400).json({
                                mensaje: "El correo ya está en uso"
                            });
                        }

                        return res.status(500).json({
                            mensaje: "Error al registrar"
                        });
                    }

                    res.json({
                        mensaje: "Usuario creado"
                    });

                }
            );

        }

    );

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
                token,

                usuario: {
                    nombre: usuario.nombre,
                    rol: usuario.rol
                }
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