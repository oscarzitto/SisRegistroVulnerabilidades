const express = require("express");

const router = express.Router();

const verificarToken =
require("../middleware/authMiddleware");

const {
    listarAuditoria
}
=
require("../controllers/auditoriaController");

const verificarRol = 
require("../middleware/rolesMiddleware");

router.get(
    "/auditoria",
    verificarToken,
    verificarRol("admin"),
    listarAuditoria
);

module.exports = router;