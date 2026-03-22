const express = require('express')
const UserAuthController = require('../controller/auth.controller')
const router = express.Router()


router.post('/register',UserAuthController.UserRegister)
router.post('/login',UserAuthController.UserLogin)
router.get('/get-info',UserAuthController.GetInfo)

module.exports = router