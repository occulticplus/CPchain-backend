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
        walletName : req.body.walletName,
        walletKey : req.body.walletKey
    }
    try {
        const options = {
            method : 'POST',
            url : 'http://127.0.0.1:8888/v1/wallet/unlock/',
            header : {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            body : JSON.stringify([msg.walletName, msg.walletKey])
        }
        request(options, (error, response, body) => {
            if (error) throw new Error(error);
            console.log(body);
            if (typeof(body) == 'object' && Object.keys(body).length === 0) {
                res.cookie('walletKey', req.body.walletKey);
                console.log('ok unlocked the wallet.');
                res.send('ok unlocked the wallet.');
            } else {
                console.log('Failed to unlock the wallet: The walletKey is not correct');
                res.send('The key of wallet is wrong. Please check your password.');
            }
        })
    } catch (e) {
        console.log(e);
        res.send({
            'status' : 404,
            'message' : 'Cannot login and unlock wallet. Some Problems happened.'
        });
    }
})

module.exports = router