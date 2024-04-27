const userValidationMiddleware = require('../middleware/userValidationMiddleware.cjs')

const router = require('express').Router()

router.post('/registration',userValidationMiddleware.signup)

module.exports = router