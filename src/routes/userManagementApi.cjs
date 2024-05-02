const { updateProfile } = require('../controller/user.controller.cjs')
const { verifyToken } = require('../middleware/userAccessValidationMiddleware.cjs')
const { 
    signup, 
    signIn, 
    signOut, 
    deleteUser, 
    changePwd, 
    otpSender, 
    reSendOtp, 
    passwordReset, 
    updateUsrProfile,
    getProfile
} = require('../middleware/userValidationMiddleware.cjs')

const router = require('express').Router()

router.post('/registration',signup)
router.post('/signin',signIn)
router.delete('/signout', verifyToken, signOut)
router.delete('/deleteUser', verifyToken, deleteUser)
router.put('/changePassword', verifyToken, changePwd)
router.patch('/sentOtp', otpSender )
router.patch('/resentOtp', reSendOtp)
router.patch('/resetPassword', passwordReset)
router.put('/updateProfile',verifyToken, updateUsrProfile)
router.get('/getProfile', verifyToken, getProfile)

module.exports = router