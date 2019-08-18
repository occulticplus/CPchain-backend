const router = require('express').Router();
const request = require('request');

const { Api, JsonRpc, RpcError, Numeric } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder
//const { TextEncoder, TextDecoder } = require('text-encoding');          // React Native, IE11, and Edge Browsers only


const rpc = new JsonRpc('http://127.0.0.1:8000', { fetch });

router.post('/', (req, res) => {
    const msg = {
        //sourceUser: req.from,
        destUser: req.to,
        copyrightID: req.id
    };

    const options = {
        method: 'POST',
        url: 'http//127.0.0.1:6666/v1/wallet/list_keys',
        header: {'Content-type': 'application/json'}
    }
    let tranInfo = {};

    if (req.cookies['walletKey'] === null || req.cookies['userName']) {
        throw new Error('The user has not signed in. Please first signed in to unlock the wallet.');
    }
    options.body = JSON.stringify([msg.sourceUser, req.cookies['walletKey']]);
    msg.sourceUser = req.cookies['userName'];

    try {
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (error) {
                    console.log(error);
                    throw new Error('Can\'t get the keys.Please checkout if you are signed in.')
                }
                console.log(body);
                tranInfo.publicKey = JSON.parse(body)[0][0];
                tranInfo.privateKey = JSON.parse(body)[0][1];
                resolve();
            })
        }).then(() => {
            return new Api({
                rpc,
                signatureProvider: new JsSignatureProvider([tranInfo.privateKey]),
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder()
            }).transact({
                actions:[{
                    account: 'admin',
                    name: 'cptrans',
                    authorization: [{
                        actor: msg.sourceUser,
                        permission: 'active'
                    }],
                    data: {
                        from: msg.sourceUser,
                        to: msg.destUser,
                        id: msg.copyrightID
                    }
                }]
            })
        }).catch(error => {
            console.log(error);
            console.log('Please ensure the sourceUser is the wallet owner.');
        }).then((value) => {
            console.log(value);
            console.log('---------------------------');
            // todo: check the return value. Value should be success/fail.

            options.url = 'http://127.0.0.1:5000/api/transaction';
            options.header = {'Content-type' : 'application/json; charset=utf-8'};
            options.body = JSON.stringify({
                id: msg.copyrightID,
                to: msg.destUser
            })

            request(options, (error, response, body) => {
                if (error) {
                    console.log(error);
                    throw new Error('Can\'t execute transactions on smart backends.');
                }
                console.log(body);
                const ret = JSON.parse(body);
                if (ret.result == '1') {
                    res.send({
                        status: 200,
                        message: 'successfully transacted copyright.'
                    })
                } else if (ret.result == '0') {
                    res.send({
                        status: 400,
                        message: 'failed to transact copyright.Something went wrong.'
                    });
                }
                console.log('unexpected end.');
                throw new Error('Unhandled result value!');
            })
        });
    } catch(e) {
        console.log(e);
        res.send({
            status: 500,
            message: 'Cannot deal operations. Exceptions happend.'
        })
    }
})

module.exports = router