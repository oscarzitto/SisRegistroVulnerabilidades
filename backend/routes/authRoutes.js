const express = require("express");
const router = express.Router();
const verificarToken = require("../middleware/authMiddleware");
const verificarRol =
require("../middleware/rolesMiddleware");

const {register,login, logout, cambiarPassword}
= require("../controllers/authController");

router.post(
    "/register",
    verificarToken,
    verificarRol("admin"),
    register
);

router.post("/login",login);

router.post("/logout", verificarToken, logout);

router.post("/cambiar-password", verificarToken, cambiarPassword);

module.exports = router;