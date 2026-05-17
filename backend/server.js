const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Base de datos
require("./database/db");

// App
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas API
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const verificarToken = require("./middleware/authMiddleware");

app.use(authRoutes);
app.use(testRoutes);

// Ruta principal
app.get("/",(req,res)=>{

    res.send("API funcionando SIII");

});

// Ruta protegida
app.get(
"/protegida",
verificarToken,

(req,res)=>{

res.json({

mensaje:"Ruta protegida funcionando",

usuario:req.usuario

});

});

// Puerto
const PORT=process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT,()=>{

    console.log(
        `Servidor corriendo en puerto ${PORT}`
    );

});