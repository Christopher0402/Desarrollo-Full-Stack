const request = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

// 👉 Esto cierra la conexión a Mongo cuando terminan las pruebas
afterAll(async () => {
    await mongoose.connection.close()
})

describe('Auth', () => {
    it('login devuelve token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@test.com',
                password: '123456'
            })

        expect(res.body.token).toBeDefined()
    })
})
