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

module.exports = {
    crearHallazgo,
    listarHallazgos
};