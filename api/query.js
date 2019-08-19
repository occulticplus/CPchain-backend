const router = require('express').Router();
const request = require('request');
const Config = require('../config/basic');

const { Api, JsonRpc, RpcError, Numeric } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

const privateKeys = Config.privateKeyList;

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc('http://127.0.0.1:8000', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

router.post('/', (req, res) => {
    const msg = {
        id: req.id,
        name: req.name
    }
    try {
        const options = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/api/query',
            header: {'Content-type': 'applications/json'},
            body: JSON.stringify({name: msg.name})
        }

        request(options, (error, response, body) => {
            if (error) {
                console.log(error);
                throw new Error('Cannot connect to smart server!');
            }
            const result = JSON.parse(body);
            console.log(msg.name + '\'s transaction record: ')
            result.forEach((r, i) => {
                console.log("the " + i + "th record:");
                console.log({
                    id: r.id,
                    hash: r.hash
                })
            });

            res.send({
                status: 200,
                message: 'successfully got the user\'s tranaction list.',
                data: body
            }).end();
        })
    } catch (e) {
        console.log(e);
        res.send({
            status: 500,
            message: 'Cannot Excecute operations. Something went wrong.'
        })
    }
})

module.exports = router