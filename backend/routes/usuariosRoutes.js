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
    verificarRol("admin"),
    listarUsuarios
);

// 📌 ELIMINAR USUARIO 
router.delete(
    "/usuarios/:id",
    verificarToken,
    verificarRol("admin"),
    eliminarUsuario
);

module.exports = router;