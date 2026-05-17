const db = require("../database/db");
const bcrypt = require("bcrypt");

const register = async (req,res)=>{

    const {nombre,correo,password,rol}=req.body;

    if(!nombre || !correo || !password || !rol){
        return res.status(400).json({
            mensaje:"Faltan campos"
        });
    }

    try{

        const hash = await bcrypt.hash(password,10);

        db.run(
        `INSERT INTO usuarios
        (nombre,correo,password_hash,rol)
        VALUES(?,?,?,?)`,
        [nombre,correo,hash,rol],

        function(err){

            if(err){

                return res.status(500).json({
                    mensaje:"Error al registrar"
                });
            }

            res.json({
                mensaje:"Usuario creado"
            });

        });

    }catch(error){

        res.status(500).json({
            mensaje:"Error"
        });

    }

};

module.exports={register};