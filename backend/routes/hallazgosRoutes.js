const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const verificarRol=
require("../middleware/rolesMiddleware");

const{
crearHallazgo,
listarHallazgos,
editarHallazgo,
eliminarHallazgo
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

router.delete(
"/hallazgos/:id",
verificarToken,
eliminarHallazgo
);
 
module.exports=router;