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
const authRoutes=require("./routes/authRoutes");
const testRoutes=require("./routes/testRoutes");

app.use(authRoutes);
app.use(testRoutes);

// Ruta principal
app.get("/",(req,res)=>{

    res.send("API funcionando SIII");

});

// Puerto
const PORT=process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT,()=>{

    console.log(
        `Servidor corriendo en puerto ${PORT}`
    );

});