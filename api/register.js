
const router = require('express').Router()

const { Api, JsonRpc, RpcError } = require('eosjs');
const { signatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

const rpc = new JsonRpc('http://127.0.0.1:8000', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

router.post('/', async (req, res) => {
    try {
        const msg = {
            name: req.body.name,
            key: req.body.key
        }
        console.log('Register: name = ' + msg.name + ', Private key = ' + msg.key);
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
                            key: api.convertLegacyPublicKey(msg.key),
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    },
                    active: {
                        threshold: 1,
                        keys: [{
                            key: api.convertLegacyPublicKey(msg.key),
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
        console.log("Created a new account. Name: " + msg.name + " whose key is " + msg.key);
        res.send("Successfully created account!");
    } catch (e) {
        console.log(e);
        res.reject("Error : something went wrong.");
    }
})

module.exports = router