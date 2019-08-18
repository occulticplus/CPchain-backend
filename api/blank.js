const router = require('express').Router()

const { Api, JsonRpc, RpcError } = require('eosjs');
const numeric = require('eosjs/dist/eosjs-numeric');
const { signatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

const rpc = new JsonRpc('http://127.0.0.1:8000', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const request = require('request');
const inm = require('../config/blank');


router.get('/', (req, res) => {
    // res.send('this is a blank.'
    const a = 'as';
    const b = 'we can';
    console.log('henlo friend');
    try {
        request({url: 'http://127.0.0.1:3000/api/blank/foo/', method: 'POST', header: 'application/json', body: JSON.stringify([a, b])},
            (error, response, body) => {
                if (error) throw new Error(error);
                console.log(body);
            }
        );
    } catch(e) {
        console.log(e);
    }
})

router.post('/foo', (req, res) => {
    console.log('may i acuqire a bespo');
    console.log(req.body);
    //res.send('this is a blank.')
})

router.get('/inm', (req, res) => {
    let a = 1;
    a = a + 1;
    console.log('now a is ' + a);
    console.log('yjsnpi is' + inm.yjsnpi);
    inm.yjsnpi += 1;
    inm.akys = 26;
    console.log(inm);
    const cookie = require('../config/blank');
    console.log(cookie);
    res.send('ok');
})

router.get('/cookie', (req, res) => {
    let a = 1;
    a = a + 1;
    console.log('now a is ' + a);
    console.log('yjsnpi is' + inm.yjsnpi);
    inm.yjsnpi += 1;
    inm.akys = 26;
    console.log(inm);
    const cookie = require('../config/blank');
    console.log(cookie);
    res.send('ok');
})

router.get('/num', (req, res) => {
    const result = numeric.convertLegacyPublicKey("EOSSB");
    console.log(result);
    res.send(result);
})

module.exports = router