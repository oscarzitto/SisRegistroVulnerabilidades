const express=require("express");

const router=express.Router();

const verificarToken=
require("../middleware/authMiddleware");

router.get(
"/perfil",
verificarToken,

(req,res)=>{

    res.json({

        mensaje:"Ruta protegida funcionando",

        usuario:req.usuario

    });

});

module.exports=router;