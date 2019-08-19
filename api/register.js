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
            IDcard : req.body.IDcard,
            email : req.body.email,
            //walletName : req.body.walletName
        };
        const accountInfo = {
            publicKey : '',
            privateKey : ''
        }
        console.log('Register: name = ' + msg.name + ', walletName = ' + msg.name);
        let walletInfo = '';
        const walletRet = {};
        const options = {
            'method' : 'POST',
            'url': 'http://127.0.0.1:6666/v1/wallet/create',
            'headers' : { 'content-type' : 'application/json'},
            'body' : '"' + msg.name + '"',
        };
        return await new Promise((res, rej) => {
            console.log('want to create wallet.');
            request(options, (error, response, body) => {
                if (error) throw new Error(error);
                //walletKey = body;
                console.log('wallet recall1:');
                console.log(body);
                if(typeof(body) === 'string') {
                    /* some problems. In body is the wallet pwd. Write it out to file.*/
                    walletInfo += 'Wallet Name : ' + msg.name + '\n';
                    walletRet.walletName = msg.name;
                    walletInfo += 'Wallet Password : ' + body + '\n';
                    walletRet.walletPassword = body;
                    res();
                } else {
                    console.log(body);
                    rej('Error: Cannot create wallet');
                }
            });

        }).catch((value) => {
            throw new Error(value);
        }).then(() => {
            return Ecc.randomKey();
        }).then(privateKey => {
            console.log('Private Key :\t', privateKey);
            console.log('Public Key :\t', Ecc.privateToPublic(privateKey));
            accountInfo.publicKey = Ecc.privateToPublic(privateKey);
            accountInfo.privateKey = privateKey;
            walletInfo += 'Account Name : ' + msg.name + '\n';
            walletRet.accountName = msg.name;
            walletInfo += 'Account Private Key : ' + privateKey + '\n';
            walletRet.privateKey = privateKey;
            walletInfo += 'Account Public Key : ' + Ecc.privateToPublic(privateKey) + '\n';
            walletRet.publicKey = Ecc.privateToPublic(privateKey);
            options.url = 'http://127.0.0.1:6666/v1/wallet/import_key';
            options.body = JSON.stringify([msg.name, accountInfo.privateKey]);
            options.headers = {'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            request(options, (error, response, body) => {
                if (error) throw new Error(error);
                console.log(body);
            })
            return api.transact({
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
            })
        }).then(()=>{
            console.log(accountInfo.privateKey);
            const sigProvider = new JsSignatureProvider([accountInfo.privateKey]);
            return new Api({ rpc,
                signatureProvider: sigProvider,
                textDecoder: new TextDecoder(),
                textEncoder: new TextEncoder()
            }).transact({
                actions : [{
                    account: 'admin',
                    name: 'userregister',
                    authorization: [{
                        actor: msg.name,
                        permission: 'active',
                    }],
                    data: {
                        uname: msg.name,
                        IDcard: msg.IDcard,
                        email: msg.email
                    },
                }],
            }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
        }).catch((value)=>{
            console.log(value);
            throw new Error('promise rejected');
        }).then(()=>{
            Config.userName = walletRet.accountName;
            Config.walletKey = walletRet.walletPassword;
            console.log('Wallet Information :\n' + walletInfo);
            res.send({
                status: 200,
                msg: "Successfully created account!",
                data: JSON.stringify(walletRet)
            });
            /*
            res.render('200', {
                status : 'success',
                message : "Successfully created account!\n" + walletInfo
            })
            */
        })
        console.log('unexpected end');

    } catch (e) {
        console.log(e);
        res.send({
            status : 500,
            message : "Something went wrong."
        });
    }
})

module.exports = router