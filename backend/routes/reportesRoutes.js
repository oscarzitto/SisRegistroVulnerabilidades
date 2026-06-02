const express=
require("express");

const router=
express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const verificarRol=
require("../middleware/rolesMiddleware");

const{
exportarCSV
}
=
require("../controllers/reportesController");

router.get(

"/exportar",

verificarToken,

verificarRol("admin","analista"),

exportarCSV

);

module.exports=router;