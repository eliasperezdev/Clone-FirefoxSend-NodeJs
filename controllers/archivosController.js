const multer = require('multer')
const shortid = require('shortid')
const Enlace = require('../models/Enlace')
const fs = require('fs')

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${extension}` );
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');



    upload(req, res, async (error) => {
        console.log(req.file);

        if(!error) {
            res.json({archivo: req.file.filename})
        } else {
            console.log(error);
            return next()
        }
    })
}

exports.eliminarArchivo = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname = '../uploads/${req.archivo')
        console.log("eliminado");
    } catch (error) {
        console.log(error);
    }
}


exports.descargarArchivo = async (req, res, next) => {

try {
        //obtiene el enlace
        const enlace = await Enlace.findOne({nombre:req.params.archivo})

        const archivo = __dirname+"/../uploads/"+req.params.archivo
        res.download(archivo)
    
        //Eliminar el enlace 
    
        //numeros de descargas
        console.log(enlace);
        const {descargas, nombre} = enlace
        if(descargas===1) {
            //eliminar archivo
            req.archivo = nombre
            //Eliminar la entrada a la bd
            await Enlace.findOneAndRemove(enlace.id)
            next() //usamos next para saltar al siguiente controlador declarado en routes
    
        } else {
            enlace.descargas--
            await enlace.save()
        }
} catch (error) {
    console.log(error);
}
}