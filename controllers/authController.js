const Usuario = require("../models/Usuario")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})
const {validationResult} = require("express-validator")

exports.autenticarUsuario = async (req, res, next) => {
    //mostrar mensajes de erores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Buscar el usuario si esta registrado
    const {email, password} = req.body
    const usuario = await Usuario.findOne({email})

    if(!usuario) {
        res.status(401).json({msg: 'El usuario no existe'})
        return next()
    }

    console.log("tata");

    //Verificar el pass y autentucar el usuario
    if(bcrypt.compareSync(password, usuario.password)) {
        //Crear jwt
        const token = jwt.sign({
            id: usuario._id,
            email: usuario.email,
            nombre: usuario.nombre
        }, process.env.SECRETA, {
            expiresIn: '8h'
        })
        res.json({token})
    } else {
        res.status(401).json({msg: "Password incorrecto"})
        return next()
    }
}

exports.usuarioAutenticado = async (req, res, next) => {
    res.json({usuario: req.usuario})

    return next()
}

