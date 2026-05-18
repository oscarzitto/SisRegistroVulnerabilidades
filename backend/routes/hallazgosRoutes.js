const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const{
crearHallazgo,
listarHallazgos
}
=
require("../controllers/hallazgosController");

router.post(
"/hallazgos",
verificarToken,
crearHallazgo
);

router.get(
"/hallazgos",
verificarToken,
listarHallazgos
);

module.exports=router;