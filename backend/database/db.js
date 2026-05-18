// CREA LAS TABLAS SI NO EXISTEN Y CONECTA A LA BASE DE DATOS

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.log("Error BD:", err.message);
    } else {
        console.log("Base de datos conectada");

        db.run(`
        CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            rol TEXT NOT NULL
        )
        `);

        db.run(`
        CREATE TABLE IF NOT EXISTS hallazgos(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT,
            activo_afectado TEXT,
            tipo TEXT,
            severidad TEXT,
            descripcion TEXT,
            evidencia TEXT,
            recomendacion TEXT,
            estado TEXT,
            responsable TEXT
        )
        `);

    }
});

module.exports = db;