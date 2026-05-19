const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {

    let { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
        return res.status(400).json({
            mensaje: "Faltan campos"
        });
    }

    db.all(
        `SELECT correo FROM usuarios WHERE correo LIKE ?`,
        [`${correo.split("@")[0]}%@${rol}.cl`],
        async (err, rows) => {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error"
                });
            }

            let finalCorreo = correo;

            if (rows.length > 0) {
                finalCorreo =
                    `${correo.split("@")[0]}${rows.length}@${rol}.cl`;
            }

            const hash = await bcrypt.hash(password, 10);

            db.run(
                `INSERT INTO usuarios
                (nombre, correo, password_hash, rol, must_change_password)
                VALUES (?,?,?,?,1)`,
                [
                    nombre,
                    finalCorreo,
                    hash,
                    rol
                ],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            mensaje: "Error al registrar"
                        });
                    }

                    res.json({
                        mensaje: "Usuario creado",
                        correo: finalCorreo
                    });
                }
            );
        }
    );
};


// ================= LOGIN =================
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
                { expiresIn: "1h" }
            );

            // auditoría
            db.run(
                `INSERT INTO auditoria (usuario, evento, fecha)
                 VALUES (?,?,datetime('now'))`,
                [usuario.nombre, "Inicio sesión"]
            );

            res.json({
                mensaje: "Login correcto",
                token,
                mustChangePassword: usuario.must_change_password === 1,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                }
            });
        }
    );
};


// ================= LOGOUT =================
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


// ================= CAMBIAR PASSWORD (🔥 NUEVO) =================
const cambiarPassword = (req, res) => {

    const { actual, nueva } = req.body;
    const userId = req.usuario.id;

    if (!actual || !nueva) {
        return res.status(400).json({
            mensaje: "Faltan campos"
        });
    }

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!regex.test(nueva)) {
        return res.status(400).json({
            mensaje:
                "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número"
        });
    }

    db.get(
        "SELECT * FROM usuarios WHERE id=?",
        [userId],
        async (err, user) => {

            if (err || !user) {
                return res.status(500).json({
                    mensaje: "Error"
                });
            }

            const ok = await bcrypt.compare(
                actual,
                user.password_hash
            );

            if (!ok) {
                return res.status(401).json({
                    mensaje: "Contraseña actual incorrecta"
                });
            }

            const hash = await bcrypt.hash(nueva, 10);

            db.run(
                `UPDATE usuarios
                SET password_hash=?,
                must_change_password=0
                WHERE id=?`,
                [hash, userId],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            mensaje: "Error al actualizar"
                        });
                    }

                    db.run(
                        `INSERT INTO auditoria
                        (usuario, evento, fecha)
                        VALUES (?,?,datetime('now'))`,
                        [user.nombre, "Cambio contraseña"]
                    );

                    res.json({
                        mensaje: "Contraseña actualizada"
                    });

                }
            );
        }
    );
};


// ================= EXPORT =================
module.exports = {
    register,
    login,
    logout,
    cambiarPassword
};