const { signup, signIn, signOut, deleteUser, changePwd, otpSender, reSendOtp, passwordReset, } = require('../middleware/userValidationMiddleware.cjs')

const router = require('express').Router()

router.post('/registration',signup)
router.post('/signin',signIn)
router.delete('/signout', signOut)
router.delete('/deleteUser', deleteUser)
router.put('/changePassword', changePwd)
router.patch('/sentOtp', otpSender )
router.patch('/resentOtp', reSendOtp)
router.patch('/resetPassword', passwordReset)

module.exports = router