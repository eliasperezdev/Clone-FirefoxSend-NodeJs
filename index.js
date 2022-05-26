const express = require('express')
const conectarDB = require('./config/db')
const cors = require('cors')
//Crear el servidor
const app = express()
const port = process.env.PORT || 4000


conectarDB()

const corsOption = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOption))
//Habilitar leer datos
app.use(express.json())

//Habilitar carpeta publica
app.use(express.static("uploads"))

//Rutas
app.use("/api/usuarios", require('./routes/usuarios'))
app.use("/api/auth", require('./routes/auth'))
app.use("/api/enlaces", require('./routes/enlaces'))
app.use("/api/archivos", require('./routes/archivos'))

app.listen(port, '0.0.0.0', ()=> {
    console.log("El servidor esta funcionando en el puerto ", port);
} )
