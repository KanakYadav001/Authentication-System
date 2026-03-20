const express = require('express')
const morgan = require('morgan')
const CookieParser = require('cookie-parser')
const AuthRouter = require('./routers/auth.router')
const app = express()

app.use(express.json())
app.use(CookieParser())

app.use(morgan('dev'))
app.use('/api/auth',AuthRouter)

module.exports=app