const router = require('express').Router()

const { Api, JsonRpc, RpcError } = require('eosjs');
const numeric = require('eosjs/dist/eosjs-numeric');
const { signatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

const rpc = new JsonRpc('http://127.0.0.1:8000', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

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

router.get('/num/', (req, res) => {
    const result = numeric.convertLegacyPublicKey("EOSSB");
    console.log(result);
    res.send(result);
})

module.exports = router