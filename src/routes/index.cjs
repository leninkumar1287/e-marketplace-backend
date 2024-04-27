const router = require('express').Router()
const userManagementApi = require('./userManagementApi.cjs')

router.use('/user',userManagementApi)

module.exports = router