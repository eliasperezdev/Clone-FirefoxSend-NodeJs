const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')

    if(authHeader) {
        //Obtenr token
        const token = authHeader.split(' ')[1]

        //Comprobar el jwt
        try {
            const usuario = jwt.verify(token, process.env.SECRETA)

            req.usuario = usuario
        } catch (error) {
            console.log("Jwt no es valido");
            console.log(error);
        }

    } 

    return next()
}