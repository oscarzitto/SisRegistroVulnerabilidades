const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.log("Error BD:", err.message);
        return;
    }

    db.serialize(() => {

        console.log("Base de datos conectada");

        // TABLAS
        db.run(`CREATE TABLE IF NOT EXISTS usuarios(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            rol TEXT NOT NULL,
            must_change_password INTEGER NOT NULL DEFAULT 1
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS hallazgos(
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
        )`);

        db.run(`
        CREATE TABLE IF NOT EXISTS historial(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hallazgo_id INTEGER,
            usuario TEXT,
            accion TEXT,
            detalle TEXT,
            fecha TEXT
        )
        `);

        db.run(`CREATE TABLE IF NOT EXISTS auditoria(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT,
            evento TEXT,
            fecha TEXT
        )`);

        // 👇 SEED ADMIN (IMPORTANTE AQUÍ)
        db.get("SELECT COUNT(*) as total FROM usuarios", (err, row) => {

            if (err) {
                console.log("Error verificando usuarios");
                return;
            }

            if (row.total === 0) {

                bcrypt.hash("admin", 10, (err, hash) => {

                    if (err) {
                        console.log("Error creando admin");
                        return;
                    }

                    db.run(
                        `INSERT INTO usuarios
                        (nombre, correo, password_hash, rol, must_change_password)
                        VALUES (?,?,?,?,1)`,
                        [
                            "Admin Sistema",
                            "admin@admin.cl",
                            hash,
                            "admin"
                        ]
                    );

                    console.log("✔ Admin creado\n\tNombre: admin@admin.cl\n\tPassword: admin\n\t/!/ Cambiar contraseña /!/");

                });
            }
        });
    });
});

module.exports = db;