const db = require("../database/db");

const crearHallazgo = (req, res) => {

    console.log(req.body);

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

    if (

        !fecha ||
        !activo_afectado?.trim() ||
        !tipo?.trim() ||
        !evidencia?.trim() ||
        !recomendacion?.trim() ||
        !responsable?.trim()

    ) {

        return res.status(400).json({

            mensaje:
                "Completa todos los campos"

        });

    }

    const regexTipo =

        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.()]+$/;


    if (

        !regexTipo.test(tipo)

    ) {

        return res.status(400).json({

            mensaje:
                "El tipo contiene caracteres no permitidos"

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
        recomendacion,
        estado,
        responsable
        )
        VALUES(?,?,?,?,?,?,?,?,?)`,

        [
            fecha,
            activo_afectado,
            tipo,
            severidad,
            descripcion,
            evidencia,
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
                mensaje: "Hallazgo creado"
            });

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

    console.log(req.body);

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

    if (

        !fecha ||
        !activo_afectado?.trim() ||
        !tipo?.trim() ||
        !evidencia?.trim() ||
        !recomendacion?.trim() ||
        !responsable?.trim()

    ) {

        return res.status(400).json({

            mensaje:
                "Completa todos los campos"

        });

    }

    const regexTipo =

        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.()]+$/;


    if (

        !regexTipo.test(tipo)

    ) {

        return res.status(400).json({

            mensaje:
                "El tipo contiene caracteres no permitidos"

        });

    }

    db.run(

        `UPDATE hallazgos
            SET

            fecha=?,
            activo_afectado=?,
            tipo=?,
            severidad=?,
            descripcion=?,
            evidencia=?,
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
            recomendacion,
            estado,
            responsable,
            id
        ],

        function (err) {

            if (err) {

                console.log(err);

                return res.status(500).json({

                    mensaje: "Error"

                });

            }

            db.run(
                `INSERT INTO historial
                (hallazgo_id, usuario, accion, detalle, fecha)
                VALUES (?,?,?,?,datetime('now'))`,
                [
                    id,
                    req.usuario.nombre,
                    "UPDATE",
                    `Editó hallazgo "${tipo}" ID ${id} del activo "${activo_afectado}" a → Estado "${estado}"`
                ]
            );

            db.run(
                `INSERT INTO auditoria
                (usuario, evento, fecha)
                VALUES (?,?,datetime('now'))`,
                [
                    req.usuario.nombre,
                    `Editó hallazgo "${tipo}" ID ${id} del activo "${activo_afectado}" a → Estado "${estado}"`
                ]
            );

            res.json({
                mensaje: "Hallazgo actualizado"
            });

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
                        (hallazgo_id, usuario, accion, detalle, fecha)
                        VALUES (?,?,?,?,datetime('now'))`,
                        [
                            id,
                            req.usuario.nombre,
                            "DELETE",
                            `Se eliminó hallazgo del activo "${hallazgo.activo_afectado}" (${hallazgo.tipo})`
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