const {check} = require('express-validator')
const { autenticarUsuario, usuarioAutenticado } = require('../controllers/authController')
const router = require('express').Router()
const auth = require('../middleware/auth')

router.post('/', 
[
    check('email', 'Agregue un email válido').isEmail(),
    //check('password', 'El password no puede ser vacio').isLength({min: 6}),
],
autenticarUsuario)

router.get('/', 
 auth,
usuarioAutenticado)

module.exports = router