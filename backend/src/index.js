// let's go!
require('dotenv').config({path: 'variables.env'})
const createServer = require('./createServer')
const db = require('./db')

const app = createServer()

app.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    }
}, deets => {
    console.log(`server running on http://localhost:${deets.port}`)
})
