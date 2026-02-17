const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { crearProducto, obtenerProductos } = require('../controllers/productoController')

router.post('/', auth, crearProducto)
router.get('/', auth, obtenerProductos)

module.exports = router
