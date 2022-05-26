const Enlace = require("../models/Enlace");
const {validationResult} = require('express-validator')
const shortid = require('shortid')
const bcrypt = require('bcrypt')
exports.nuevoEnlace = async (req, res, next) => {
    
    // Revisar si hay errores
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({errores: errores.array()});
    }

    // console.log(req.body);

    // Crear un objeto de Enlace
    const { nombre_original, nombre } = req.body;

    const enlace = new Enlace();
    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;
    

    // Si el usuario esta autenticado
    if(req.usuario) {
        const { password, descargas } = req.body;

        // Asignar a enlace el número de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // asignar un password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash( password, salt );
        }

        // Asignar el autor
        enlace.autor = req.usuario.id
    }

    // Almacenar en la BD
    try {
        await enlace.save();
        return res.json({ msg : `${enlace.url}` });
        next();
    } catch (error) {
        console.log(error);
    }
}

exports.todosEnlaces = async (req,res) => {

    try {
        const enlaces = await Enlace.find({})
            .select("url -_id")
        res.json({enlaces})
    } catch (error) {
        console.log(error);
    }
}


exports.obtenerEnlace  = async (req, res, next) =>{
    const enlace = await Enlace.findOne({url: req.params.url})

    if(!enlace) {
        res.status(404).json({msg: "ese enlace no existe"})
        return next()
    }

    //Si existe el enlace
    res.json({archivo: enlace.nombre, password: false})

    next()

}

exports.tienePassword = async (req,res,next) => {
    const enlace = await Enlace.findOne({url: req.params.url})

    if(!enlace) {
        res.status(404).json({msg: "ese enlace no existe"})
        return next()
    }

    if(enlace.password) {
        return res.json({password: true, enlace: enlace.url})
    }

    next()
}

exports.verificarPassword = async (req,res,next) => {
    const {url } = req.params
    const {password} = req.body

    const enlace = await Enlace.findOne({url})

    if(bcrypt.compareSync(password, enlace.password)) {
        //Descargar el archvo
        next()
    }
    else {
        return res.status(401).json({msg: "Password incorrecto"})
    }
}