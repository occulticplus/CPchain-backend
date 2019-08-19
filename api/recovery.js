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
        base: req.base
    }
    try {
        const options = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/api/hash',
            header: {'Content-type' : 'application/json'},
            body: JSON.stringify(msg.base)
        }
        const picInfo = {}
        const accountInfo = {}
        if (Config.userName === null || Config.walletKey === null) {
            console.log('User has not login. Refused to serve.');
            res.send({
                status: 403,
                message: 'Please sign in before any other operations.'
            });
        }
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    console.log(error);
                    throw new Error('Cannot get the hash value of picture');
                }
                console.log(body);
                picInfo.hash = JSON.parse(body).hash;
                resolve();
            })
        }).then(() => {
            options.url = 'http://127.0.0.1:6666/v1/wallet/list_keys';
            options.body = JSON.stringify([Config.userName, Config.walletKey]);
            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        throw new Error('Cannot get account keys from wallet!');
                    }
                    accountInfo.publicKey = JSON.parse(body)[0][0];
                    accountInfo.privateKey = JSON.parse(body)[0][1];
                    resolve();
                })
            })
        }).then(() => {
            return new Api({
                rpc,
                signatureProvider: new JsSignatureProvider([accountInfo.privateKey]),
                textDecoder:  new TextDecoder(),
                textEncoder: new TextEncoder()
            }).transact({
                actions:[{
                    account: 'admin',
                    name: 'cpcheck',
                    authorization: [{
                        actor: Config.userName,
                        permission: 'active'
                    }],
                    data: {
                        hash: picInfo.hash
                    }
                }]
            })
        }).catch((value) => {
            console.log(value);
            console.log('------------------------------');
            if (value.result === 'success') {
                options.method = 'POST';
                options.url = 'http://127.0.0.1:5000/api/recovery';
                options.body = {
                    id: msg.id,
                    base: msg.base
                }
                request(options, (error, response, body) => {
                    if (error) {
                        consoel.log(error);
                        throw new Error('Cannot operate recovery. Something went wrong.');
                    }
                    const ret = JSON.parse(body).base64;
                    if (typeof(ret) === 'undefined') {

                    }
                    res.send({
                        status: 200,
                        message: 'successfully recovered the image!',
                        data: JSON.stringify({
                            base64: ret
                        })
                    }).end();
                })
            } else {
                // todo: check the value, and excecute operations when the copyright has conflicts.
                consol.log(JSON.parse(value));
                throw new Error('can\'t understand the chain\'s return value.');
            }
        }).then(() => {
            res.send({
                status: 304,
                message: 'the picture is not violating the copyright.'
            }).end();
        })
    } catch(e) {
        console.log(e);
        res.send({
            status: 500,
            msg:'Can\'t execute opreations. Something unexpected happend.'
        })
    }
})

module.exports = router