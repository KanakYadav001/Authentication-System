const express = require('express')
const UserAuthController = require('../controller/auth.controller')
const router = express.Router()


router.post('/register',UserAuthController.UserRegister)
router.post('/login',UserAuthController.UserLogin)
router.get('/get-info',UserAuthController.GetInfo)
router.get('/get-refresh-token',UserAuthController.GetRefreshToken)
router.get('/logout',UserAuthController.Logout)
router.get('/logout-all',UserAuthController.LogoutAll)
router.get('/verify-email',UserAuthController.VerifyEmail)
module.exports = router