const { registration } = require('../controller/user.controller.cjs')

const router = require('express').Router()

router.post('/registration',registration)

module.exports = router