const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./database/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use(authRoutes);

app.get("/", (req,res)=>{
    res.send("API funcionando SIII");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`);
});