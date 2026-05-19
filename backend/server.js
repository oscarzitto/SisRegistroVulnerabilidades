const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./database/db"); // SOLO IMPORTA

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use(require("./routes/authRoutes"));
app.use(require("./routes/testRoutes"));
app.use(require("./routes/hallazgosRoutes"));
app.use(require("./routes/reportesRoutes"));
app.use("/historial", require("./routes/historialRoutes"));
app.use(require("./routes/auditoriaRoutes"));
app.use(require("./routes/usuariosRoutes"));

app.get("/", (req, res) => {
    res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});