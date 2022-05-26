const router = require('express').Router()
const { subirArchivo, eliminarArchivo,descargarArchivo } = require('../controllers/archivosController')
const auth = require('../middleware/auth')



router.post('/',
    auth,
    subirArchivo
)

router.get("/:archivo", descargarArchivo, eliminarArchivo)

module.exports = router