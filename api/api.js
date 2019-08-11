const router = require('express').Router()
const blank = require('./blank')
const login = require('./login')
const register = require('./register')
const list = require('./list')
const mark = require('./mark')
const recovery = require('./recovery')
const save = require('./recovery')
const transaction = require('./transaction')

router.use('/blank', (req, res, next) => {
    console.log('get in blank')
    next()
}, blank)

router.use('/login', login)
router.use('/register', register)
router.use('/list', list)
router.use('/mark', mark)
router.use('/recovery', recovery)
router.use('/save', save)
router.use('/transaction', transaction)

/*
router((req, res) => {
    res.fatal(501)
})
*/
module.exports = router