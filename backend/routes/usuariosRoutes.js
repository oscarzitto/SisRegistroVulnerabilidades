const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const {
listarUsuarios
}
=
require("../controllers/usuariosController");

router.get(
"/usuarios",
verificarToken,
listarUsuarios
);

module.exports=router;