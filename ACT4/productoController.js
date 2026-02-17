const Producto = require('../models/Producto')

exports.crearProducto = async (req, res) => {
    const producto = await Producto.create(req.body)
    res.json(producto)
}

exports.obtenerProductos = async (req, res) => {
    const productos = await Producto.find()
    res.json(productos)
}
