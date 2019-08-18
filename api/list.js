const router = require('express').Router();
const request = require('request');

router.get('/', (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/api/list'
        }
        request(options, (error, response, body) => {
            if (error) {
                console.log(error);
                throw new Error('Cannot connect to smart Servers. Please checkout connection.');
            }
            if (typeof(JSON.parse(body)) != 'object') {
                console.log(typeof(JSON.parse(body)));
                console.log(JSON.parse(body));
                throw new Error('Cannot get valid results from smart Servers!');
            }
            const result = JSON.parse(body);
            result.forEach((r, i) => {
                console.log('record ' + i + ':');
                console.log({
                    id: r.id,
                    owner: r.owner,
                    hash: r.hash
                });
            })
            res.send({
                status : 200,
                message : 'Successfully get the list!',
                data: body
            })
        })
    } catch(e) {
        console.log(e);
        res.send({
            status: 500,
            message: 'Can\'t execute opreations. Something unexpected happend.'
        })
    }

});

module.exports = router;