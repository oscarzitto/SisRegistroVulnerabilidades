const db = require("../database/db");

const { Parser } = require("json2csv");

const exportarCSV = (req, res) => {

    db.all(
        "SELECT * FROM hallazgos",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    mensaje: "Error"
                });
            }

            // 🧠 FIX: evitar crash si no hay datos
            if (!rows || rows.length === 0) {

                return res.status(200).json({
                    mensaje: "No hay datos para exportar"
                });

            }

            const parser = new Parser();
            const csv = parser.parse(rows);

            db.run(
                `INSERT INTO auditoria
                (usuario, evento, fecha)
                VALUES (?,?,datetime('now'))`,
                [
                    req.usuario.nombre,
                    "Exportó reporte CSV de hallazgos"
                ]
            );

            res.header("Content-Type", "text/csv");
            res.attachment("hallazgos.csv");

            return res.send(csv);

        }
    );

};

module.exports = {
    exportarCSV
};