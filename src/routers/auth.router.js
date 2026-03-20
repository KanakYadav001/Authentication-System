const express = require('express')
const UserAuthController = require('../controller/auth.controller')
const router = express.Router()


router.post('/register',UserAuthController.UserRegister)
router.post('/login',UserAuthController.UserLogin)


module.exports = router