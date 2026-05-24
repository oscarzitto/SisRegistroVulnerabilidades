const multer = require("multer");

const storage = multer.diskStorage({

    destination: (req,file,cb)=>{

        cb(null,"uploads/");

    },

    filename:(req,file,cb)=>{

        const nombre =
            Date.now() +
            "-" +
            file.originalname;

        cb(null,nombre);

    }

});

const fileFilter=(req,file,cb)=>{

    const permitidos=[
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    if(permitidos.includes(file.mimetype)){

        cb(null,true);

    }else{

        cb(
            new Error("Solo JPG PNG JPEG"),
            false
        );

    }

};

module.exports=
multer({
    storage,
    fileFilter
});