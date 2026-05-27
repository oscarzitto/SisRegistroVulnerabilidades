const express = require("express");
const router = express.Router();

const verificarToken = require("../middleware/authMiddleware");
const verificarRol =
require("../middleware/rolesMiddleware");

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

// 📌 ELIMINAR USUARIO 
router.delete(
    "/usuarios/:id",
    verificarToken,
    eliminarUsuario
);

module.exports = router;