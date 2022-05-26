const Usuario = require("../models/Usuario");
const bcrypt = require('bcrypt')
const {validationResult} = require("express-validator")

exports.nuevoUsuario = async (req, res) => {
    console.log(req);
    //mostrar mensajes de erores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Verificar si el usuario esta registrado
    const { email, password } = req.body

    let usuario = await Usuario.findOne({email})

    if(usuario) {
        return res.status(400).json({msg: "El usuario ya esta registrado"})
    }
    //Crear usaurio
    usuario = new Usuario(req.body);

    //Hashear password
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    try {    
        await usuario.save()

        res.json({msg: "Usuario creado"})
    } catch (error) {
        console.log(error);
    }

}