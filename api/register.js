const router = require('express').Router()

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only

const rpc = new JsonRpc('http://127.0.0.1:6666', { fetch });

router.post('/', async (req, res) => {
    try {
        const msg = {
            name: req.body.name,
            key: req.body.key
        }
        const result = await api.transact({
            actions: [{
                account: 'eosio',
                name: 'newaccount',
                authorization: [{
                    actor: 'useraaaaaaaa',
                    permission: 'active',
                }],
                data: {
                    creator: 'eosio',
                    name: msg.name,
                    owner: {
                        threshold: 1,
                        keys: [{
                            key: msg.key,
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    },
                    active: {
                        threshold: 1,
                        keys: [{
                            key: msg.key,
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