const router = require('express').Router()

router.get('/', (req, res) => {
    // res.send('this is a blank.')
    res.json(
        {
            'status': 404,
            'content': req.params.r
        })
})

module.exports = router