const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");

const {
    listarUsuarios,
    eliminarUsuario
} = require("../controllers/usuariosController");

// 📌 LISTAR USUARIOS
router.get(
    "/usuarios",
    verificarToken,
    listarUsuarios
);

// 📌 ELIMINAR USUARIO 👈 AQUÍ VA LO QUE PREGUNTAS
router.delete(
    "/usuarios/:id",
    verificarToken,
    eliminarUsuario
);

module.exports = router;