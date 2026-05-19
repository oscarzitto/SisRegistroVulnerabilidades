const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcrypt");

// Base de datos
const db = require("./database/db");

db.get("SELECT COUNT(*) as total FROM usuarios", (err, row) => {

    if (err) {
        console.log("Error verificando usuarios");
        return;
    }

    if (row.total === 0) {

        bcrypt.hash("admin", 10, (err, hash) => {

            db.run(
                `INSERT INTO usuarios
                (nombre, correo, password_hash, rol, must_change_password)
                VALUES (?,?,?,?,0)`,
                [
                    "Admin Sistema",
                    "admin@admin.cl",
                    hash,
                    "admin"
                ]
            );

            console.log("✔ Admin creado");
        });
    }
});

// App
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas API
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const hallazgosRoutes = require("./routes/hallazgosRoutes");
const reportesRoutes = require("./routes/reportesRoutes");
const historialRoutes = require("./routes/historialRoutes");
const auditoriaRoutes = require("./routes/auditoriaRoutes");

app.use(authRoutes);
app.use(testRoutes);
app.use(hallazgosRoutes);
app.use(reportesRoutes);
app.use("/historial", historialRoutes);
app.use(auditoriaRoutes);

app.use(
    require("./routes/usuariosRoutes")
);


// Ruta principal
app.get("/", (req, res) => {

    res.send("API funcionando SIII");

});


// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {

    console.log(
        `Servidor corriendo en puerto ${PORT}`
    );

});