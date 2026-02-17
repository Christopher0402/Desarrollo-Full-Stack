require('dotenv').config()
const express = require('express')
const conectarDB = require('./config/db')

// Rutas
const authRoutes = require('./routes/auth')
const productosRoutes = require('./routes/productos')

const app = express()

// Conectar MongoDB
conectarDB()

// Middleware JSON
app.use(express.json())

// 👉 Servir archivos HTML
app.use(express.static('public'))

// Rutas API
app.use('/auth', authRoutes)
app.use('/productos', productosRoutes)

// Ruta prueba
app.get('/', (req, res) => {
    res.send('Servidor funcionando')
})

// Puerto
const PORT = 3000

// Exportar para Jest
module.exports = app

// Levantar servidor solo si no es test
if (require.main === module) {
    app.listen(PORT, () => console.log('Servidor listo'))
}
