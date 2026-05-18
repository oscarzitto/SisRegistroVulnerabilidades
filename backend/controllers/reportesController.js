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

            const parser =
                new Parser();

            const csv =
                parser.parse(rows);

            res.header(
                "Content-Type",
                "text/csv"
            );

            res.attachment(
                "hallazgos.csv"
            );

            return res.send(csv);

        }

    );

};

module.exports = {
    exportarCSV
};