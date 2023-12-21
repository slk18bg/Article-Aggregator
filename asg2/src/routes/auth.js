const express = require('express')
const router = express.Router()

const {
    register,
    login,
    processLogin,
    processRegistration,
    processLogout,
} = require('../controllers/AuthenticationController')

const {guest} = require('../middleware/guest');
const {authenticated} = require('../middleware/authenticated');

router.get('/login', guest, login)

router.get('/register', guest, register)

router.post('/login', guest, processLogin)

router.post('/register', guest, processRegistration)

router.post('/logout', authenticated, processLogout)

module.exports = router
