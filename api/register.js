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

const Ecc = require('eosjs-ecc');

router.post('/', async (req, res) => {
    try {
        const msg = {
            name: req.body.name,
            //key: req.body.key,
            walletName : req.body.walletName
        };
        const accountInfo = {
            publicKey : '',
            privateKey : ''
        }
        console.log('Register: name = ' + msg.name + ', Private key = ' + msg.key);
        let walletInfo = '';
        let options = {
            method : 'POST',
            url: 'http://127.0.0.1:6666/v1/wallet/create',
            headers : { 'content-type' : 'application/json'},
            body : msg.walletName
        };
        new Promise((res, rej) => {
            console.log('want to create wallet.');
            request(options, (error, response, body) => {
                if (error) throw new Error(error);
                //walletKey = body;
                console.log(body);
            });
            if(typeof(body) == 'string') {
                /* some problems. In body is the wallet pwd. Write it out to file.*/
                walletInfo += 'Wallet Name : ' + msg.walletName + '\n';
                walletInfo += 'Wallet Password : ' + body + '\n';
                res();
            } else {
                rej('Error: Cannot create wallet');
            }
        }).catch((value) => {
            throw new Error(value);
        }).then(() => {
            return Ecc.randomKey();
        }).then(privateKey => {
            console.log('Private Key :\t', privateKey);
            console.log('Public Key :\t', ecc.privateToPublic(privateKey));
            accountInfo.publicKey = ecc.privateToPublic(privateKey);
            accountInfo.privateKey = privateKey;
            walletInfo += 'Account Name : ' + msg.name + '\n';
            walletInfo += 'Account Private Key : ' + privateKey + '\n';
            walletInfo += 'Account Public Key : ' + ecc.privateToPublic(privateKey) + '\n';
            options.url = 'http://127.0.0.1:6666/v1/wallet/import_key';
            options.body = [msg.walletName, privateKey];
            options.headers = {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            request(options, (error, response, body) => {
                if (error) throw new Error(error);
                console.log(body);
            })
        })

        const result = await api.transact({
            actions: [{
                account: 'eosio',
                name: 'newaccount',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    creator: 'eosio',
                    name: msg.name,
                    owner: {
                        threshold: 1,
                        keys: [{
                            key: Numeric.convertLegacyPublicKey(accountInfo.publicKey),
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    },
                    active: {
                        threshold: 1,
                        keys: [{
                            key: Numeric.convertLegacyPublicKey(accountInfo.publicKey),
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    },
                },
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        console.log('Wallet Information :\n' + walletInfo);
        res.send("Successfully created account!\n" + walletInfo);
    } catch (e) {
        console.log(e);
        res.render('404', {
            status : 114514,
            message : "Something went wrong"
        });
    }
})

module.exports = router