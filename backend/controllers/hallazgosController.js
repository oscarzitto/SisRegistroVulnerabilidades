const db = require("../database/db");
const path = require("path");

const crearHallazgo = (req, res) => {

    console.log(req.body);

    const imagen = req.file
        ? `/uploads/${req.file.filename}`
        : "";

    const {
        fecha,
        activo_afectado,
        tipo,
        severidad,
        descripcion,
        evidencia, // texto: URL, log, descripción, etc.
        recomendacion,
        estado,
        responsable
    } = req.body;

    if (
        !fecha ||
        !activo_afectado?.trim() ||
        !tipo?.trim() ||
        !recomendacion?.trim() ||
        !responsable?.trim()
    ) {

        return res.status(400).json({
            mensaje: "Completa todos los campos"
        });

    }

    const regexTipo =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.()]+$/;

    if (!regexTipo.test(tipo)) {

        return res.status(400).json({
            mensaje:
                "El tipo contiene caracteres no permitidos"
        });

    }

    db.get(

        `SELECT id
        FROM hallazgos
        WHERE activo_afectado=?
        AND tipo=?
        AND fecha=?`,

        [
            activo_afectado,
            tipo,
            fecha
        ],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    mensaje: "Error"
                });

            }

            if (row) {

                return res.status(400).json({
                    mensaje:
                        "Ya existe un hallazgo similar"
                });

            }

            db.run(

                `INSERT INTO hallazgos
                (
                fecha,
                activo_afectado,
                tipo,
                severidad,
                descripcion,
                evidencia,
                imagen,
                recomendacion,
                estado,
                responsable
                )
                VALUES(?,?,?,?,?,?,?,?,?,?)`,

                [
                    fecha,
                    activo_afectado,
                    tipo,
                    severidad,
                    descripcion,
                    evidencia,
                    imagen,
                    recomendacion,
                    estado,
                    responsable
                ],

                function (err) {

                    if (err) {

                        console.log(err);

                        return res.status(500).json({
                            mensaje: "Error",
                            detalle: err.message
                        });

                    }

                    db.run(

                        `INSERT INTO auditoria
                        (
                        usuario,
                        evento,
                        fecha
                        )
                        VALUES(?,?,datetime('now'))`,

                        [
                            req.usuario.nombre,
                            `Creó hallazgo ${tipo}`
                        ]

                    );

                    res.json({
                        mensaje:
                            "Hallazgo creado"
                    });

                }

            );

        }

    );

};

const listarHallazgos = (req, res) => {

    db.all(
        "SELECT * FROM hallazgos",
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    mensaje: "Error"
                });

            }

            res.json(rows);

        });

};

const editarHallazgo = (req, res) => {

    const { id } = req.params;

    const {
        fecha,
        activo_afectado,
        tipo,
        severidad,
        descripcion,
        evidencia,
        recomendacion,
        estado,
        responsable
    } = req.body;

    // si llega nueva imagen se reemplaza,
    // si no, mantiene la anterior
    let imagen;

    if (req.body.eliminarImagen === "true") {

        imagen = "";

    }
    else if (req.file) {

        imagen = `/uploads/${req.file.filename}`;

    }
    else {

        imagen = req.body.imagen;

    }

    if (
        !fecha ||
        !activo_afectado?.trim() ||
        !tipo?.trim() ||
        !recomendacion?.trim() ||
        !responsable?.trim()
    ) {

        return res.status(400).json({
            mensaje: "Completa todos los campos"
        });

    }

    const regexTipo =
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.()]+$/;

    if (!regexTipo.test(tipo)) {

        return res.status(400).json({
            mensaje:
                "El tipo contiene caracteres no permitidos"
        });

    }

    db.get(

        `SELECT id
        FROM hallazgos
        WHERE activo_afectado=?
        AND tipo=?
        AND fecha=?
        AND id != ?`,

        [
            activo_afectado,
            tipo,
            fecha,
            id
        ],

        (err, row) => {

            if (err) {

                return res.status(500).json({
                    mensaje: "Error"
                });

            }

            if (row) {

                return res.status(400).json({
                    mensaje:
                        "Ya existe un hallazgo similar"
                });

            }

            db.get(

                `SELECT * FROM hallazgos WHERE id=?`,
                [id],

                (err, hallazgoAnterior) => {

                    if (err || !hallazgoAnterior) {

                        return res.status(500).json({
                            mensaje: "Hallazgo no encontrado"
                        });

                    }

                    db.run(

                        `INSERT INTO historial
                        (
                        hallazgo_id,
                        usuario,
                        accion,
                        datos_anteriores,
                        datos_nuevos,
                        fecha
                        )
                        VALUES
                        (?,?,?,?,?,datetime('now'))`,

                        [
                            id,
                            req.usuario.nombre,
                            "UPDATE",

                            JSON.stringify(
                                hallazgoAnterior
                            ),

                            JSON.stringify({

                                fecha,
                                activo_afectado,
                                tipo,
                                severidad,
                                descripcion,
                                evidencia,
                                imagen,
                                recomendacion,
                                estado,
                                responsable
                            })
                        ]

                    );


                    db.run(

                        `UPDATE hallazgos
                        SET

                        fecha=?,
                        activo_afectado=?,
                        tipo=?,
                        severidad=?,
                        descripcion=?,
                        evidencia=?,
                        imagen=?,
                        recomendacion=?,
                        estado=?,
                        responsable=?

                        WHERE id=?`,

                        [
                            fecha,
                            activo_afectado,
                            tipo,
                            severidad,
                            descripcion,
                            evidencia,
                            imagen,
                            recomendacion,
                            estado,
                            responsable,
                            id
                        ],

                        function (err) {

                            if (err) {

                                return res.status(500).json({
                                    mensaje: "Error"
                                });

                            }

                            db.run(
                                `INSERT INTO auditoria
                                (
                                usuario,
                                evento,
                                fecha
                                )
                                VALUES
                                (?,?,datetime('now'))`,
                                [
                                    req.usuario.nombre,
                                    `Editó hallazgo "${tipo}" ID ${id}`
                                ]
                            );

                            res.json({
                                mensaje: "Hallazgo actualizado"
                            });

                        }

                    );

                }

            );

        }

    );

};

const eliminarHallazgo = (req, res) => {

    const { id } = req.params;

    db.get(
        "SELECT * FROM hallazgos WHERE id=?",
        [id],
        (err, hallazgo) => {

            if (err || !hallazgo) {
                return res.status(500).json({
                    mensaje: "Error al obtener hallazgo"
                });
            }

            db.run(
                `DELETE FROM hallazgos WHERE id=?`,
                [id],
                function (err) {

                    if (err) {
                        return res.status(500).json({
                            mensaje: "Error al eliminar"
                        });
                    }

                    // AUDITORÍA
                    db.run(
                        `INSERT INTO auditoria
                        (usuario, evento, fecha)
                        VALUES (?,?,datetime('now'))`,
                        [
                            req.usuario.nombre,
                            `DELETE - Activo: ${hallazgo.activo_afectado} | ID: ${id}`
                        ]
                    );

                    // HISTORIAL
                    db.run(
                        `INSERT INTO historial
                        (hallazgo_id, usuario, accion, datos_anteriores, datos_nuevos, fecha)
                        VALUES (?,?,?,?,?,datetime('now'))`,
                        [
                            id,
                            req.usuario.nombre,
                            "DELETE",

                            JSON.stringify(hallazgo), // 👈 AQUÍ LO IMPORTANTE

                            null
                        ]
                    );

                    res.json({
                        mensaje: "Hallazgo eliminado"
                    });

                }
            );

        }
    );
};

module.exports = {
    crearHallazgo,
    listarHallazgos,
    editarHallazgo,
    eliminarHallazgo
};