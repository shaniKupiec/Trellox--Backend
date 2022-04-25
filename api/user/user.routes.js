const express = require('express')
const {getUser, getUsers} = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)


module.exports = router