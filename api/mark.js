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
    try {
        const msg = {
            name : req.body.name,
            base : req.body.base
        }
        if (typeof(msg.base) != 'string') {
            throw new Error('The picuture is not based in base64. Please check the input.');
        }
        if (!req.cookies['walletKey']) { // this should be edited. we should check if the the user is loggedIn.
            throw new Error('The user has not signed in. Please first signed in to unlock the wallet.');
        }
        // now the req must have 'Walletkey' in its cookies.
        console.log('The walletKey : ' + req.cookies['walletKey']);
        const options = {
            method : 'POST',
            url : 'http://127.0.0.1:5000/api/mark',
            header : 'applications/json',
            body : JSON.stringify({base: msg.base})
        }
        let pictureInfo;
        return new Promise((resolve, reject) => {
            //console.log(options);
            request(options, (error, response, body) => {
                if (error) {
                    console.log(error);
                    throw new Error('Can\'t get marks of the picture!');
                }
                console.log(body);
                console.log('++++++++++++++++++++++++++++++++++++++');
                pictureInfo = JSON.parse(JSON.stringify(body));
                resolve(body);
            })
        }).then(() => {
            return new Promise((resolve, reject) => {
                options.url = 'http://127.0.0.1:6666/v1/wallet/list_keys';
                options.body = JSON.stringify([msg.name, req.cookies['walletKey']]);
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        throw new Error('Can\'t get the keys.Please checkout if you are signed in.');
                    }
                    console.log(body);
                    console.log('*********************************************');
                    pictureInfo.publicKey = body[0][0];
                    pictureInfo.privateKey = body[0][1];
                    resolve();
                });
            })
        }).then(() => {
            return new Api({
                rpc,
                signatureProvider : new JsSignatureProvider([pictureInfo.privateKey]),
                textDecoder: new TextDecoder(),
                textEncoder: new TextEncoder()
            }).transact({
                actions: [{
                    account: 'admin',
                    name: 'cpregist',
                    authorization: [{
                        actor: msg.name,
                        permission: 'active'
                    }],
                    data: {
                        owner: msg.name,
                        hash: pictureInfo.hash
                    }
                }]
            });
        }).then((value) => {
            console.log(value);
            // todo : check the return value.
            console.log('//////////////////////////////');
            return rpc.get_table_rows({
                json: true,
                code: 'admin',
                table: 'image',
                scope: 'admin',
                limit: 1,
                reverse: true,
                show_payer: true
            })
        }).then((value) => {
            console.log(value);
            console.log('````````````````````````````');
            if (value.rows[0].id == null) {
                throw new Error('Cannot read id of the transaction.');
            }
            const id = value.rows[0].id;
            return new Promise((resolve, reject) => {
                options.url = 'https://127.0.0.1:5000/api/save';
                options.body = {
                    id: JSON.stringify(id),
                    owner: msg.name,
                    hash: pictureInfo.hash,
                    data: msg.base,
                    rand_num: pictureInfo.rand_num_base64,
                    r: pictureInfo.r,
                    key: pictureInfo.key,
                    logo: pictureInfo.logo_base64
                };
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        throw new Error('Can\'t save to smart servers!');
                    }
                    console.log(body);
                    console.log('--------------------------------------------');
                    if (body.result == 1) {
                        console.log('Succeeded: successfully checked the picture!');
                        res.send({
                            status: '200',
                            message: 'The copyright of the picture has signed!'
                        })
                    } else if (body.result == 0) {
                        console.log('Failed: the copyright has conflicted.');
                        res.send({
                            status: '114514',
                            message: 'the copyright has conflicted with other images.'
                        })
                    }
                })
            })
        }).catch(error => {
            console.log('REJECTED: ' + error);
            res.send({
                status: '500',
                message: 'Can\'t deal operations.'
            });
        })

    } catch (e) {
        console.log(e);
        res.send('Something wrong happened. We can\'t mark the picture.');
    }
});

module.exports = router