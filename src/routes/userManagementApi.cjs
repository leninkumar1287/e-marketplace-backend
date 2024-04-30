const { signout, deleteProfile } = require('../controller/user.controller.cjs')
const userValidationMiddleware = require('../middleware/userValidationMiddleware.cjs')

const router = require('express').Router()

router.post('/registration',userValidationMiddleware.signup)
router.post('/signin', userValidationMiddleware.signin)
router.delete('/signout', signout)
router.delete('/deleteUser',deleteProfile)

module.exports = router