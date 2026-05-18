const express = require("express");

const router = express.Router();

const verificarToken =
require("../middleware/authMiddleware");

const {
    listarAuditoria
}
=
require("../controllers/auditoriaController");

router.get(
    "/auditoria",
    verificarToken,
    listarAuditoria
);

module.exports = router;