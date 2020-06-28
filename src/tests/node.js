const { JsonRpc, RpcError, Api } = require('../../dist');
const { JsSignatureProvider } = require('../../dist/qqbcjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const privateKey = '5K7fZxoHUhb4Jx9AQgTAPpLMF5yykm8vyfnp5a62mz1dGcABhPY'; // replace with "qqbctest1112" account private key
/* new accounts for testing can be created by unlocking a cleos wallet then calling:
 * 1) cleos create key --to-console (copy this privateKey & publicKey)
 * 2) cleos wallet import
 * 3) cleos create account bob publicKey
 * 4) cleos create account alice publicKey
 */

const rpc = new JsonRpc('http://www.qqbc.vip', { fetch });
const signatureProvider = new JsSignatureProvider([privateKey]);
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

const transactWithConfig = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'qqbctest1112',
            permission: 'active',
        }],
        data: {
            from: 'qqbctest1112',
            to: 'qqbctest1113',
            quantity: '1.0000 QQBC',
            memo: '',
        },
    }]
}, {
    blocksBehind: 3,
    expireSeconds: 30,
});

const transactWithoutConfig = async () => {
    const transactionResponse = await transactWithConfig();
    const blockInfo = await rpc.get_block(transactionResponse.processed.block_num - 3);
    const currentDate = new Date();
    const timePlusTen = currentDate.getTime() + 10000;
    const timeInISOString = (new Date(timePlusTen)).toISOString();
    const expiration = timeInISOString.substr(0, timeInISOString.length - 1);

    return await api.transact({
        expiration,
        ref_block_num: blockInfo.block_num & 0xffff,
        ref_block_prefix: blockInfo.ref_block_prefix,
        actions: [{
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                actor: 'qqbctest1112',
                permission: 'active',
            }],
            data: {
                from: 'qqbctest1112',
                to: 'qqbctest1113',
                quantity: '1.0000 QQBC',
                memo: '',
            },
        }]
    });
};


const transactWithoutBroadcast = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'qqbctest1112',
            permission: 'active',
        }],
        data: {
            from: 'qqbctest1112',
            to: 'qqbctest1113',
            quantity: '1.0000 QQBC',
            memo: '',
        },
    }]
}, {
    broadcast: false,
    blocksBehind: 3,
    expireSeconds: 30,
});

const broadcastResult = async (signaturesAndPackedTransaction) => await api.pushSignedTransaction(signaturesAndPackedTransaction);

const transactShouldFail = async () => await api.transact({
    actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
            actor: 'qqbctest1112',
            permission: 'active',
        }],
        data: {
            from: 'qqbctest1112',
            to: 'qqbctest1113',
            quantity: '1.0000 QQBC',
            memo: '',
        },
    }]
});

const rpcShouldFail = async () => await rpc.get_block(-1);

const rpcgetinfo = async () => await rpc.get_info();

module.exports = {
    transactWithConfig,
    transactWithoutConfig,
    transactWithoutBroadcast,
    broadcastResult,
    transactShouldFail,
    rpcShouldFail,
    rpcgetinfo
};
