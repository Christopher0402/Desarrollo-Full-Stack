const Usuario = require('../models/Usuario')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.registro = async (req, res) => {
    const { email, password } = req.body

    const hash = await bcrypt.hash(password, 10)

    const usuario = await Usuario.create({
        email,
        password: hash
    })

    res.json(usuario)
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    const usuario = await Usuario.findOne({ email })
    if (!usuario) return res.status(400).json({ msg: 'Usuario no existe' })

    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) return res.status(400).json({ msg: 'Password incorrecto' })

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET)

    res.json({ token })
}
