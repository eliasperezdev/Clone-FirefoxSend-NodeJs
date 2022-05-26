const { nuevoUsuario } = require('../controllers/usuariosController')
const {check} = require('express-validator')
const router = require('express').Router()
router.post('/', 
[
    check('nombre', 'El nombre es obligatiorio').not().isEmpty(),
    check('email', 'Agregue un email válido').isEmail(),
    check('password', 'El password debe ser de al menos 6 digitos').isLength({min: 6}),
],
nuevoUsuario)

module.exports = router