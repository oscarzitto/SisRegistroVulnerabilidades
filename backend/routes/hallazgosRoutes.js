const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

const verificarRol=
require("../middleware/rolesMiddleware");

const upload=
require("../middleware/uploads");

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
upload.single("imagen"),
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
upload.single("imagen"),
editarHallazgo
);

router.delete(
"/hallazgos/:id",
verificarToken,
verificarRol("admin"), // solo admin
eliminarHallazgo
);

module.exports=router;