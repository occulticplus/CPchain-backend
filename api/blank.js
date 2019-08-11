const router = require('express').Router()

router.get('/', (req, res) => {
    // res.send('this is a blank.')
    res.json(
        {
            'status': 302,
            'else': req.params.r
        })
})

router.get('/oo/', (req, res) => {
    res.send('this is a blank.')
})

module.exports = router