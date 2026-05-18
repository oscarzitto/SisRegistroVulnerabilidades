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
verificarRol("admin","analista"),
crearHallazgo
);

router.get(
"/hallazgos",
verificarToken,
verificarRol("admin","analista"),
listarHallazgos
);

router.put(
"/hallazgos/:id",
verificarToken,
verificarRol("admin","analista"),
editarHallazgo
);

router.delete(
"/hallazgos/:id",
verificarToken,
verificarRol("admin"), // solo admin
eliminarHallazgo
);

module.exports=router;