const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const verificarRol=
require("../middleware/rolesMiddleware");

const{
crearHallazgo,
listarHallazgos,
editarHallazgo
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

router.put(
"/hallazgos/:id",
verificarToken,
verificarRol("admin"),
editarHallazgo
);
 
module.exports=router;