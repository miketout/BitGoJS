/**
 * @prettier
 */
import * as nock from 'nock';
import { Environment, Environments } from '../../../src/v2/environments';
import { BlockchairApi } from '../../../src/v2/recovery/blockchairApi';
const fixtures = require('../../../test/v2/fixtures/coins/recovery');
const blockchairContext = fixtures.blockchairContext;
const btcKrsRecoveryDecodedTx = fixtures.btcKrsRecoveryDecodedTx;
const btcNonKrsRecoveryDecodedTx = fixtures.btcNonKrsRecoveryDecodedTx;
const emptyBlockchairBtcAddressData = fixtures.emptyBlockchairBtcAddressData;

export function nockSmartbitDecodeTx(txHex, env, isKrsRecovery, smartbitOnline = true) {
  const decodedTx = isKrsRecovery ? btcKrsRecoveryDecodedTx : btcNonKrsRecoveryDecodedTx;
  const smartbitBaseUrl = `${env.smartbitBaseUrl}/blockchain`;
  if (smartbitOnline) {
    nock(smartbitBaseUrl).post('/decodetx', { hex: txHex }).reply(200, decodedTx);
  } else {
    nock(smartbitBaseUrl).post('/decodetx', { hex: txHex }).socketDelay(10000).replyWithError(503); // "server unavailable"
  }
}

export function nockbitcoinFees(fastestFee: number, halfHourFee: number, hourFee: number) {
  nock('https://bitcoinfees.earn.com').get('/api/v1/fees/recommended').reply(200, {
    fastestFee,
    halfHourFee,
    hourFee,
  });
}

export function nockbitcoinFeesOffline(fastestFee: number, halfHourFee: number, hourFee: number) {
  nock('https://bitcoinfees.earn.com')
    .get('/api/v1/fees/recommended')
    .replyWithError('please wait while predictions are being generated');
}

export function nockCoingecko(usd: number, coinGeckoName: string) {
  const body = {};
  body[coinGeckoName] = { usd };
  nock('https://api.coingecko.com').get(`/api/v3/simple/price?ids=${coinGeckoName}&vs_currencies=USD`).reply(200, body);
}

export function blockchairNockBtcRecovery(bitgo, isKrsRecovery, smartbitOnline = true, coin = 'bitcoin') {
  const env = bitgo.getEnv() as any;
  const blockchairURL = BlockchairApi.getBaseUrl(env, 'bitcoin');
  nockbitcoinFees(600, 600, 100);
  const txHex = isKrsRecovery
    ? '010000000174eda73749d65473a8197bac5c26660c66d60cc77a751298ef74931a478382e100000000b500483045022100ca835086284cb84e9cbf96464057dcd58fa9b4b37cf4c51171c109dae13ec9ee02203ca1b77600820e670d7bd0c6bd8fbfc003c2a67ffedab7950a1c7f9d0fc17b4c014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53aeffffffff0230456c000000000017a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac787301b0f000000000017a9141b60c33def13c3eda4cf4835e11a633e4b3302ec8700000000'
    : '010000000174eda73749d65473a8197bac5c26660c66d60cc77a751298ef74931a478382e100000000fdfd00004730440220513ff3a0a4d72230a7ca9b1285d5fa19669d7cccef6a9c8408b06da666f4c51f022058e8cc58b9f9ca585c37a8353d87d0ab042ac081ebfcea86fda0da1b33bf474701483045022100e27c00394553513803e56e6623e06614cf053834a27ca925ed9727071d4411380220399ab1a0269e84beb4e8602fea3d617ffb0b649515892d470061a64217bad613014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53aeffffffff012c717b000000000017a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac78700000000';

  if (isKrsRecovery) {
    // unnecessary market data removed
    nockCoingecko(10000, 'bitcoin');
  }
  nock(blockchairURL)
    .get('/dashboards/address/2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg?key=my_______SecretApiKey')
    .reply(200, {
      data: { '2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg': emptyBlockchairBtcAddressData },
      blockchairContext,
    })
    .get('/dashboards/address/2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg')
    .reply(200, {
      data: { '2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg': emptyBlockchairBtcAddressData },
      blockchairContext,
    })
    .get('/dashboards/address/2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr')
    .reply(200, {
      data: { '2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr': emptyBlockchairBtcAddressData },
      blockchairContext,
    })
    .get('/dashboards/address/2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr?key=my_______SecretApiKey')
    .reply(200, {
      data: { '2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr': emptyBlockchairBtcAddressData },
      blockchairContext,
    })
    .get('/dashboards/address/2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj')
    .reply(200, {
      data: {
        '2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw')
    .reply(200, {
      data: {
        '2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw': {
          address: {
            type: 'scripthash',
            script_hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
            balance: 8125000,
            balance_usd: 0,
            received: 8125000,
            received_usd: 0,
            spent: 0,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 1,
            first_seen_receiving: '2017-06-12 23:17:43',
            last_seen_receiving: '2017-06-12 23:17:43',
            first_seen_spending: null,
            last_seen_spending: null,
            scripthash_type: null,
            transaction_count: 1,
          },
          transactions: ['e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74'],
          utxo: [
            {
              block_id: 1128383,
              transaction_hash: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              index: 0,
              value: 8125000,
            },
          ],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw': {
          address: {
            type: 'scripthash',
            script_hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
            balance: 8125000,
            balance_usd: 0,
            received: 8125000,
            received_usd: 0,
            spent: 0,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 1,
            first_seen_receiving: '2017-06-12 23:17:43',
            last_seen_receiving: '2017-06-12 23:17:43',
            first_seen_spending: null,
            last_seen_spending: null,
            scripthash_type: null,
            transaction_count: 1,
          },
          transactions: ['e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74'],
          utxo: [
            {
              block_id: 1128383,
              transaction_hash: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              index: 0,
              value: 8125000,
            },
          ],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z')
    .reply(200, {
      data: {
        '2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA')
    .reply(200, {
      data: {
        '2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch')
    .reply(200, {
      data: {
        '2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC')
    .reply(200, {
      data: {
        '2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P')
    .reply(200, {
      data: {
        '2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT')
    .reply(200, {
      data: {
        '2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X')
    .reply(200, {
      data: {
        '2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym')
    .reply(200, {
      data: {
        '2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba')
    .reply(200, {
      data: {
        '2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba': emptyBlockchairBtcAddressData,
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw?key=my_______SecretApiKey')
    .reply(200, {
      data: {
        '2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw': {
          address: {
            type: 'scripthash',
            script_hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
            balance: 8125000,
            balance_usd: 0,
            received: 8125000,
            received_usd: 0,
            spent: 0,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 1,
            first_seen_receiving: '2017-06-12 23:17:43',
            last_seen_receiving: '2017-06-12 23:17:43',
            first_seen_spending: null,
            last_seen_spending: null,
            scripthash_type: null,
            transaction_count: 1,
          },
          transactions: ['e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74'],
          utxo: [
            {
              block_id: 1128383,
              transaction_hash: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              index: 0,
              value: 8125000,
            },
          ],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw')
    .reply(200, {
      data: {
        '2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw': {
          address: {
            type: 'scripthash',
            script_hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
            balance: 8125000,
            balance_usd: 0,
            received: 8125000,
            received_usd: 0,
            spent: 0,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 1,
            first_seen_receiving: '2017-06-12 23:17:43',
            last_seen_receiving: '2017-06-12 23:17:43',
            first_seen_spending: null,
            last_seen_spending: null,
            scripthash_type: null,
            transaction_count: 1,
          },
          transactions: ['e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74'],
          utxo: [
            {
              block_id: 1128383,
              transaction_hash: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              index: 0,
              value: 8125000,
            },
          ],
        },
      },
      blockchairContext,
    });

  nockSmartbitDecodeTx(txHex, env, isKrsRecovery, smartbitOnline);
}

// TODO: BG-23161 - replace smartbit block explorer which is now permanently down
export function smartBitNockBtcRecovery(bitgo, isKrsRecovery) {
  nock('https://bitcoinfees.earn.com').get('/api/v1/fees/recommended').reply(200, {
    fastestFee: 600,
    halfHourFee: 600,
    hourFee: 100,
  });

  const txHex = isKrsRecovery
    ? '010000000174eda73749d65473a8197bac5c26660c66d60cc77a751298ef74931a478382e100000000b500483045022100ca835086284cb84e9cbf96464057dcd58fa9b4b37cf4c51171c109dae13ec9ee02203ca1b77600820e670d7bd0c6bd8fbfc003c2a67ffedab7950a1c7f9d0fc17b4c014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53aeffffffff0230456c000000000017a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac787301b0f000000000017a9141b60c33def13c3eda4cf4835e11a633e4b3302ec8700000000'
    : '010000000174eda73749d65473a8197bac5c26660c66d60cc77a751298ef74931a478382e100000000fdfd00004730440220513ff3a0a4d72230a7ca9b1285d5fa19669d7cccef6a9c8408b06da666f4c51f022058e8cc58b9f9ca585c37a8353d87d0ab042ac081ebfcea86fda0da1b33bf474701483045022100e27c00394553513803e56e6623e06614cf053834a27ca925ed9727071d4411380220399ab1a0269e84beb4e8602fea3d617ffb0b649515892d470061a64217bad613014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53aeffffffff012c717b000000000017a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac78700000000';
  const decodedTx = isKrsRecovery
    ? {
        success: true,
        transaction: {
          Version: '1',
          LockTime: '0',
          Vin: [
            {
              TxId: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              Vout: '0',
              ScriptSig: {
                Asm: '0 3045022100ca835086284cb84e9cbf96464057dcd58fa9b4b37cf4c51171c109dae13ec9ee02203ca1b77600820e670d7bd0c6bd8fbfc003c2a67ffedab7950a1c7f9d0fc17b4c[ALL] 522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53ae',
                Hex: '00483045022100ca835086284cb84e9cbf96464057dcd58fa9b4b37cf4c51171c109dae13ec9ee02203ca1b77600820e670d7bd0c6bd8fbfc003c2a67ffedab7950a1c7f9d0fc17b4c014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53ae',
              },
              CoinBase: null,
              TxInWitness: null,
              Sequence: '4294967295',
            },
          ],
          Vout: [
            {
              Value: 0.070956,
              N: 0,
              ScriptPubKey: {
                Asm: 'OP_HASH160 c39dcc27823a8bd42cd3318a1dac8c25789b7ac7 OP_EQUAL',
                Hex: 'a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac787',
                ReqSigs: 1,
                Type: 'scripthash',
                Addresses: ['2NB5Ynem6iNvA6GBLZwRxwid3Kui33729Nw'],
              },
            },
            {
              Value: 0.0099,
              N: 1,
              ScriptPubKey: {
                Asm: 'OP_HASH160 1b60c33def13c3eda4cf4835e11a633e4b3302ec OP_EQUAL',
                Hex: 'a9141b60c33def13c3eda4cf4835e11a633e4b3302ec87',
                ReqSigs: 1,
                Type: 'scripthash',
                Addresses: ['2Mujz9eicmgpPcdScRJTywVK3EQNHDJG3yN'],
              },
            },
          ],
          TxId: '946dbefaefa5452daba373c0e0e3ada7d74bc4cf2a27518c9fcc581f19b0cb2b',
        },
      }
    : {
        success: true,
        transaction: {
          Version: '1',
          LockTime: '0',
          Vin: [
            {
              TxId: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
              Vout: '0',
              ScriptSig: {
                Asm: '0 30440220513ff3a0a4d72230a7ca9b1285d5fa19669d7cccef6a9c8408b06da666f4c51f022058e8cc58b9f9ca585c37a8353d87d0ab042ac081ebfcea86fda0da1b33bf4747[ALL] 3045022100e27c00394553513803e56e6623e06614cf053834a27ca925ed9727071d4411380220399ab1a0269e84beb4e8602fea3d617ffb0b649515892d470061a64217bad613[ALL] 522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53ae',
                Hex: '004730440220513ff3a0a4d72230a7ca9b1285d5fa19669d7cccef6a9c8408b06da666f4c51f022058e8cc58b9f9ca585c37a8353d87d0ab042ac081ebfcea86fda0da1b33bf474701483045022100e27c00394553513803e56e6623e06614cf053834a27ca925ed9727071d4411380220399ab1a0269e84beb4e8602fea3d617ffb0b649515892d470061a64217bad613014c69522102f5ca5d074093abf996278d1e82b64497333254c786e9a69d34909a785aa9af32210239125d1a21ba8ae375cd37a92e48700cbb3bc1b1268d3c3f7e1d95f42155e1a821031ab00568ea1522a55f277699110649f3b8d08022494af2cc475c09e8a43b3a3a53ae',
              },
              CoinBase: null,
              TxInWitness: null,
              Sequence: '4294967295',
            },
          ],
          Vout: [
            {
              Value: 0.080899,
              N: 0,
              ScriptPubKey: {
                Asm: 'OP_HASH160 c39dcc27823a8bd42cd3318a1dac8c25789b7ac7 OP_EQUAL',
                Hex: 'a914c39dcc27823a8bd42cd3318a1dac8c25789b7ac787',
                ReqSigs: 1,
                Type: 'scripthash',
                Addresses: ['2NB5Ynem6iNvA6GBLZwRxwid3Kui33729Nw'],
              },
            },
          ],
          TxId: '7cf7dc9e9abcb0bc4303332b128af4200b6b3730461a3bb579143b002739f51f',
        },
      };

  const env = Environments[bitgo.getEnv()] as any;
  const smartbitBaseUrl = `${env.smartBitApiBaseUrl}/blockchain`;
  nock(smartbitBaseUrl)
    .get('/address/2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg') // done
    .reply(200, {
      success: true,
      address: {
        address: '2MztRFcJWkDTYsZmNjLu9pBWWviJmWjJ4hg',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj')
    .reply(200, {
      success: true,
      address: {
        address: '2NFNu2LUvV98d5rkKobkt1JwtFe8eKpePxj',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw')
    .reply(200, {
      success: true,
      address: {
        address: '2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw',
        total: {
          received: '0.08125000',
          received_int: 8125000,
          spent: '0.00000000',
          spent_int: 0,
          balance: '0.08125000',
          balance_int: 8125000,
          input_count: 1,
          output_count: 0,
          transaction_count: 1,
        },
        confirmed: {
          received: '0.08125000',
          received_int: 8125000,
          spent: '0.00000000',
          spent_int: 0,
          balance: '0.08125000',
          balance_int: 8125000,
          input_count: 1,
          output_count: 0,
          transaction_count: 1,
        },
        unconfirmed: {
          received: '0.00000000',
          received_int: 0,
          spent: '0.00000000',
          spent_int: 0,
          balance: '0.00000000',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0.00000000',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0.00000000',
            balance_int: 0,
          },
        },
        transaction_paging: {
          valid_sort: ['txindex'],
          limit: 10,
          sort: 'txindex',
          dir: 'desc',
          prev: null,
          next: null,
          prev_link: null,
          next_link: null,
        },
        transactions: [
          {
            txid: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
            hash: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
            block: 1128383,
            confirmations: 160161,
            version: '1',
            locktime: 0,
            time: 1497309463,
            first_seen: 1497308500,
            propagation: null,
            double_spend: false,
            size: 224,
            vsize: 224,
            input_amount: '0.64999713',
            input_amount_int: 64999713,
            output_amount: '0.64899713',
            output_amount_int: 64899713,
            fee: '0.00100000',
            fee_int: 100000,
            fee_size: '446.42857143',
            coinbase: false,
            input_count: 1,
            inputs: [
              {
                addresses: ['mwCwTceJvYV27KXBc3NJZys6CjsgsoeHmf'],
                value: '0.64999713',
                value_int: 64999713,
                txid: '43bf039b4d1c069974a3f5573931c41dca5615446e8646e3e0aa1a17e586d005',
                vout: 0,
                script_sig: {
                  asm: '3045022100d7ee6bec2f134460ef70b21b6268dd2969b2e0166631cd222fd68aa48adc3798022026c832e2fdc9f9059d467d4b9d3a1516db88c8c688a1f187a147151873530ff001 02ee0cc469cd72f5462e1d407b5eb4ecfba503074b61246fe84f35161be51f8c68',
                  hex: '483045022100d7ee6bec2f134460ef70b21b6268dd2969b2e0166631cd222fd68aa48adc3798022026c832e2fdc9f9059d467d4b9d3a1516db88c8c688a1f187a147151873530ff0012102ee0cc469cd72f5462e1d407b5eb4ecfba503074b61246fe84f35161be51f8c68',
                },
                type: 'pubkeyhash',
                witness: null,
                sequence: 4294967295,
              },
            ],
            output_count: 2,
            outputs: [
              {
                addresses: ['2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw'],
                value: '0.08125000',
                value_int: 8125000,
                n: 0,
                script_pub_key: {
                  asm: 'OP_HASH160 4db7dbb57102a2e13e4474dbe38058431012e745 OP_EQUAL',
                  hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
                },
                req_sigs: 1,
                type: 'scripthash',
                spend_txid: null,
              },
              {
                addresses: ['mzBnxFSRcZ9dsNU6UaM4Ng4mtu2btJjajc'],
                value: '0.56774713',
                value_int: 56774713,
                n: 1,
                script_pub_key: {
                  asm: 'OP_DUP OP_HASH160 cccab052f1611749f3025466415edea09a03bebe OP_EQUALVERIFY OP_CHECKSIG',
                  hex: '76a914cccab052f1611749f3025466415edea09a03bebe88ac',
                },
                req_sigs: 1,
                type: 'pubkeyhash',
                spend_txid: 'ca157ac8b6572382c78d67f8fcd97b25798543ed683a36daaa65ce2413aa5e3d',
              },
            ],
            tx_index: 14334329,
            block_index: 5,
          },
        ],
      },
    })
    .get('/address/2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z')
    .reply(200, {
      success: true,
      address: {
        address: '2NAY4N8bBCthmYDHKBab6gMnS2LwpbxdF2z',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA')
    .reply(200, {
      success: true,
      address: {
        address: '2MsPSUv8yxy9SwFKWfaTSAGKwaGCBBbMuZA',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch')
    .reply(200, {
      success: true,
      address: {
        address: '2N5txkg9k3pHe6zyyKV2dwztKdDPGdJdPch',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC')
    .reply(200, {
      success: true,
      address: {
        address: '2MzU1ze7cKUFPoQgNnsAmn4Vj7GGrN8HPCC',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P')
    .reply(200, {
      success: true,
      address: {
        address: '2N3AYt6Bzqne1jagNi6Lnu42PVPshtgVQ9P',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr') // done
    .reply(200, {
      success: true,
      address: {
        address: '2NB8Z1xr86m3sePYdFfJudNrrA8rKNkPEKr',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT')
    .reply(200, {
      success: true,
      address: {
        address: '2N8pyHtgmrGrvndjteyDDrjQ2ogvUb6bqDT',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X')
    .reply(200, {
      success: true,
      address: {
        address: '2MtruqBf39BiueH1pN34rk7Ti7FGxnKmu7X',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym')
    .reply(200, {
      success: true,
      address: {
        address: '2N4F1557TjZVN15AxPRb6CbaX7quyh5n1ym',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba')
    .reply(200, {
      success: true,
      address: {
        address: '2NB54XtZQcVBhQSCgVV8AqjiobXGbNDLkba',
        total: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        confirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        unconfirmed: {
          received: '0',
          received_int: 0,
          spent: '0',
          spent_int: 0,
          balance: '0',
          balance_int: 0,
          input_count: 0,
          output_count: 0,
          transaction_count: 0,
        },
        multisig: {
          confirmed: {
            balance: '0',
            balance_int: 0,
          },
          unconfirmed: {
            balance: '0',
            balance_int: 0,
          },
        },
      },
    })
    .get('/address/2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw/unspent')
    .reply(200, {
      success: true,
      paging: {
        valid_sort: ['id'],
        limit: 10,
        sort: 'id',
        dir: 'desc',
        prev: null,
        next: null,
        prev_link: null,
        next_link: null,
      },
      unspent: [
        {
          addresses: ['2MzLAGkQVaDiW2Dbm22ETf4ePyLUcDroqdw'],
          value: '0.08125000',
          value_int: 8125000,
          txid: 'e18283471a9374ef9812757ac70cd6660c66265cac7b19a87354d64937a7ed74',
          n: 0,
          script_pub_key: {
            asm: 'OP_HASH160 4db7dbb57102a2e13e4474dbe38058431012e745 OP_EQUAL',
            hex: 'a9144db7dbb57102a2e13e4474dbe38058431012e74587',
          },
          req_sigs: 1,
          type: 'scripthash',
          confirmations: 160162,
          id: 57760457,
        },
      ],
    })
    .post('/decodetx', { hex: txHex })
    .reply(200, decodedTx);

  if (isKrsRecovery) {
    // unnecessary market data removed
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=bitcoin&vs_currencies=USD')
      .reply(200, {
        bitcoin: {
          usd: 10000,
        },
      });
  }
}

module.exports.nockBchRecovery = function nockBchRecovery(bitgo, isKrsRecovery) {
  const env = Environments[bitgo.getEnv()] as Environment;
  nock(env.bchExplorerBaseUrl)
    .get('/addr/2NEXK4AjYnUCkdUDJQgbbEGGks5pjkfhcRN')
    .reply(200, {
      addrStr: 'pr5ktpkt6verkhadrkw2sddk9lkqmcj4eyqp4uacsj',
      balance: 0,
      balanceSat: 0,
      totalReceived: 13,
      totalReceivedSat: 1300000000,
      totalSent: 13,
      totalSentSat: 1300000000,
      unconfirmedBalance: -13,
      unconfirmedBalanceSat: -1300000000,
      unconfirmedTxApperances: 0,
      txApperances: 1,
      transactions: [
        'dfa6e8fb31dcbcb4adb36ed247ceb37d32f44335f662b0bb41372a9e9419335a',
        '6b7e8df8e4d15fa210bb0551646f227888ad63e57e027c7ab360fc3413104cc0',
      ],
    })
    .get('/addr/2NBPjxjd2N7kjRNjfBfh7w1s7w5ZymVhkcr')
    .reply(200, {
      addrStr: 'prrsa89uaggdltcmkkemtqykjdsrjz385ggj894ynj',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2NFnu7v18D7wyJXUmtYMpFSmHFDkSLAZ1F3')
    .reply(200, {
      addrStr: 'prm4q57nfn9ne0n6xkefmcrg09yn3zgy4vuhfurlhx',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2MtWF8gbfSayRXd6MWuT56uyaFf6r4hdfQd')
    .reply(200, {
      addrStr: 'pqxu753reys4w2f7qu8h7h8egf02z4xpuuyu0d8pzk',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2MxVL1RiqsG53LgAdgGQHmCmhj38ENbJyPz')
    .reply(200, {
      addrStr: 'pqucx734eass2lx3pvnkal78565nkngvggwzj03lvf',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2NDDCZJvJY3F9d7S2xLknj3TeNihVDmACnA')
    .reply(200, {
      addrStr: 'prdsql2n3ws7ltmf7nwefw6d9x8kx4r38ca76cgrzr',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2NFwCuA4X6EGsRteak4smhVxDjT4eAszy3x')
    .reply(200, {
      addrStr: 'pruwyl6xd873mn8ke204zy5dzsx3w2dlsgrwxhtpvk',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2N3XcQGSrdZPDwj6z3tu3iaA3msrdzVoPXT')
    .reply(200, {
      addrStr: 'ppcv48up7qv7r6epdmy5nn3x3hyf9cjec5aglzm6x4',
      balance: 11.9999439,
      balanceSat: 1199994390,
      totalReceived: 11.9999439,
      totalReceivedSat: 1199994390,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 11.9999439,
      unconfirmedBalanceSat: 1199994390,
      unconfirmedTxApperances: 1,
      txApperances: 1,
      transactions: ['dfa6e8fb31dcbcb4adb36ed247ceb37d32f44335f662b0bb41372a9e9419335a'],
    })
    .get('/addr/2N3XcQGSrdZPDwj6z3tu3iaA3msrdzVoPXT/utxo')
    .reply(200, [
      {
        address: 'ppcv48up7qv7r6epdmy5nn3x3hyf9cjec5aglzm6x4',
        txid: 'dfa6e8fb31dcbcb4adb36ed247ceb37d32f44335f662b0bb41372a9e9419335a',
        vout: 0,
        scriptPubKey: 'a91470ca9f81f019e1eb216ec949ce268dc892e259c587',
        amount: 11.9999439,
        satoshis: 1199994390,
        confirmations: 0,
      },
    ])
    .get('/addr/2N2pAxcYMVDkx2Di3wUWjY38TH6YcpR25Wq')
    .reply(200, {
      addrStr: 'pp50g4y68mjs6s2w6ymjgujlkz88dcq0mcepzluwts',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2NCdDSWZvRRVQApYAf1FeyopozfWtLmdBTr')
    .reply(200, {
      addrStr: 'pr2fx9t3rfvse6sw9lrsvmmrsurz08wms50h204xtg',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2MuZJzi3CCnKhks9gFaBozD314y7mdBWhtN')
    .reply(200, {
      addrStr: 'pqv4h6e4qmaap8whgczs4gc98ky6evcwhudmxm0gec',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2NArEkKFAZYvGQYhDmSaEaqQLiSQkkisG9h')
    .reply(200, {
      addrStr: 'prq3j49gl7dwy90fgx9pt29ffea3nye7aufa7vved9',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    })
    .get('/addr/2N9grcQXvkZuUcH26RKRsuGewRkvXuKZeMz')
    .reply(200, {
      addrStr: 'pz6947ukfw0d5ufptll25h805334zfkhdc4agafj2y',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
    });

  if (isKrsRecovery) {
    // unnecessary market data removed
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=bitcoin-cash&vs_currencies=USD')
      .reply(200, {
        'bitcoin-cash': {
          usd: 1000,
        },
      });
  }
};

module.exports.nockXrpRecovery = function nockXrpRecovery() {
  nock('https://s.altnet.rippletest.net:51234', { allowUnmocked: false })
    .post('/', {
      method: 'account_info',
      params: [
        {
          account: 'raGZWRkRBUWdQJsKYEzwXJNbCZMTqX56aA',
          strict: true,
          ledger_index: 'current',
          queue: true,
          signer_lists: true,
        },
      ],
    })
    .reply(200, {
      result: {
        account_data: {
          Account: 'raGZWRkRBUWdQJsKYEzwXJNbCZMTqX56aA',
          Balance: '9944000000',
          Flags: 1179648,
          LedgerEntryType: 'AccountRoot',
          OwnerCount: 5,
          PreviousTxnID: '82460E9FAF24F53388DC9CBA91934B3F82107148CD20BD26E80DF774323545C3',
          PreviousTxnLgrSeq: 396996,
          Sequence: 4,
          index: 'C676D324BA53FEDF601F7EAFBC88DAC5E7440FF491EBC54066ECDB61A2B2D1EC',
          signer_lists: [
            {
              Flags: 0,
              LedgerEntryType: 'SignerList',
              OwnerNode: '0000000000000000',
              PreviousTxnID: '0E9BF2DBAA36539FA4CDB3FF8ABF5DC9A43859C33953385C9486AD63E451B2FC',
              PreviousTxnLgrSeq: 396943,
              SignerEntries: [
                {
                  SignerEntry: {
                    Account: 'raSYaBTfbeARRdacGBbs5tjA7XkyB1RC8x',
                    SignerWeight: 1,
                  },
                },
                {
                  SignerEntry: {
                    Account: 'rGevN87RpWBbdLxKCF4FAqWgRoSyMJA81f',
                    SignerWeight: 1,
                  },
                },
                {
                  SignerEntry: {
                    Account: 'rGmQHwvb5SZRbyhp4JBHdpRzSmgqADxPbE',
                    SignerWeight: 1,
                  },
                },
              ],
              SignerListID: 0,
              SignerQuorum: 2,
              index: 'A36A7ED6108FF7F871C0EC3CF573FE23CC9780436D64A2EE069A8F27E8D40471',
            },
          ],
        },
        ledger_current_index: 397138,
        queue_data: {
          txn_count: 0,
        },
        status: 'success',
        validated: false,
      },
    })
    .post('/', { method: 'fee' })
    .reply(200, {
      result: {
        current_ledger_size: '0',
        current_queue_size: '0',
        drops: {
          base_fee: '10',
          median_fee: '5000',
          minimum_fee: '10',
          open_ledger_fee: '10',
        },
        expected_ledger_size: '51',
        ledger_current_index: 397138,
        levels: {
          median_level: '128000',
          minimum_level: '256',
          open_ledger_level: '256',
          reference_level: '256',
        },
        max_queue_size: '1020',
        status: 'success',
      },
    })
    .post('/', { method: 'server_info' })
    .reply(200, {
      result: {
        info: {
          build_version: '0.70.1',
          complete_ledgers: '386967-397137',
          hostid: 'HI',
          io_latency_ms: 1,
          last_close: {
            converge_time_s: 1.999,
            proposers: 4,
          },
          load_factor: 1,
          peers: 4,
          pubkey_node: 'n9KMmZw85d5erkaTv62Vz6SbDJSyeihAEB3jwnb3Bqnr2AydRVep',
          server_state: 'proposing',
          state_accounting: {
            connected: {
              duration_us: '4999941',
              transitions: 1,
            },
            disconnected: {
              duration_us: '1202712',
              transitions: 1,
            },
            full: {
              duration_us: '94064175867',
              transitions: 1,
            },
            syncing: {
              duration_us: '6116096',
              transitions: 1,
            },
            tracking: {
              duration_us: '3',
              transitions: 1,
            },
          },
          uptime: 94077,
          validated_ledger: {
            age: 3,
            base_fee_xrp: 0.00001,
            hash: '918D326D224F8F49B07B02CD0A2207B7239BBFA824CF512F8D1D9DBCADC115E5',
            reserve_base_xrp: 20,
            reserve_inc_xrp: 5,
            seq: 397137,
          },
          validation_quorum: 4,
        },
        status: 'success',
      },
    });
};

module.exports.nockWrongChainRecoveries = function (bitgo) {
  const env = Environments[bitgo.getEnv()] as Environment;
  nock(env.uri)
    .get('/api/v2/tltc/wallet/5abacebe28d72fbd07e0b8cbba0ff39e')
    .times(2)
    .reply(200, {
      id: '5abacebe28d72fbd07e0b8cbba0ff39e',
      users: [
        {
          user: '543c11ed356d00cb7600000b98794503',
          permissions: ['admin', 'view', 'spend'],
        },
      ],
      coin: 'tltc',
      label: 'Test Wrong Chain Wallet',
      m: 2,
      n: 3,
      keys: [
        '5abaceb63cddfbb607d8306521ddf445',
        '5abaceb73cddfbb607d8306c50ee44c4',
        '5abaceb728d72fbd07e0b84f7b3e6f12',
      ],
      keySignatures: {},
      enterprise: '5578ebc76eb47487743b903166e6543a',
      tags: ['5abacebe28d72fbd07e0b8cbba0ff39e', '5578ebc76eb47487743b903166e6543a'],
      disableTransactionNotifications: false,
      freeze: {},
      deleted: false,
      approvalsRequired: 1,
      isCold: false,
      coinSpecific: {},
      admin: {
        policy: {
          id: '5abacebe28d72fbd07e0b8cc4940ef7b',
          label: 'default',
          version: 0,
          date: '2018-03-27T23:07:42.077Z',
          rules: [],
        },
      },
      clientFlags: [],
      allowBackupKeySigning: false,
      balance: 19955120,
      confirmedBalance: 19955120,
      spendableBalance: 19955120,
      balanceString: '19955120',
      confirmedBalanceString: '19955120',
      spendableBalanceString: '19955120',
      receiveAddress: {
        id: '5abacebe28d72fbd07e0b8cf3d571ba8',
        address: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
        chain: 0,
        index: 0,
        coin: 'tltc',
        wallet: '5abacebe28d72fbd07e0b8cbba0ff39e',
        coinSpecific: {
          redeemScript:
            '522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
        },
      },
      pendingApprovals: [],
    })
    .get('/api/v2/tbtc/wallet/5abace103cddfbb607d8239d806671bf')
    .times(3)
    .reply(200, {
      id: '5abace103cddfbb607d8239d806671bf',
      users: [
        {
          user: '543c11ed356d00cb7600000b98794503',
          permissions: ['admin', 'view', 'spend'],
        },
      ],
      coin: 'tbtc',
      label: 'Test Wrong Chain Wallet',
      m: 2,
      n: 3,
      keys: [
        '5abacdffae0ec7c107c7d9cf6d60a886',
        '5abacdffae0ec7c107c7d9d74f1d5bd2',
        '5abace00d73fd4bb076782d16681fe7e',
      ],
      keySignatures: {},
      enterprise: '5578ebc76eb47487743b903166e6543a',
      tags: ['5abace103cddfbb607d8239d806671bf', '5578ebc76eb47487743b903166e6543a'],
      disableTransactionNotifications: false,
      freeze: {},
      deleted: false,
      approvalsRequired: 1,
      isCold: false,
      coinSpecific: {},
      admin: {
        policy: {
          id: '5abace103cddfbb607d8239e5c91e605',
          label: 'default',
          version: 0,
          date: '2018-03-27T23:04:48.905Z',
          rules: [],
        },
      },
      clientFlags: [],
      allowBackupKeySigning: false,
      balance: 43998878,
      confirmedBalance: 43998878,
      spendableBalance: 43998878,
      balanceString: '43998878',
      confirmedBalanceString: '43998878',
      spendableBalanceString: '43998878',
      receiveAddress: {
        id: '5abace3c79f343cc0741e5b856b92a72',
        address: '2N31dEkgPtfcgf9A1q7GZhaY5dHdeLSdkNq',
        chain: 0,
        index: 1,
        coin: 'tbtc',
        wallet: '5abace103cddfbb607d8239d806671bf',
        coinSpecific: {
          redeemScript:
            '5221030c7fdefebab31e66961651a6b5391528b3bbaeb4252bc4a9bae788594c5c20b62103bc6ae4c5b81c5acdb40254725195ab52c3a1432896d10c35a277c10b737fe93321031483169ceebf3d10b1c707684b5a53308e3cfc1930cc6144d910f3aba8e769a153ae',
        },
      },
      pendingApprovals: [],
    })
    .get('/api/v2/tltc/wallet/5abacebe28d72fbd07e0b8cbba0ff39e/address/Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V')
    .times(4)
    .reply(200, {
      id: '5abacebe28d72fbd07e0b8cf3d571ba8',
      address: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
      chain: 0,
      index: 0,
      coin: 'tltc',
      wallet: '5abacebe28d72fbd07e0b8cbba0ff39e',
      coinSpecific: {
        redeemScript:
          '522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
      },
      balance: {
        updated: '2018-03-27T23:33:10.713Z',
        totalReceived: 60000000,
        totalSent: 60000000,
      },
    })
    .get('/api/v2/tltc/wallet/5abacebe28d72fbd07e0b8cbba0ff39e/address/QjpwWvj3Y82e3WChS3pcGkRYEBbniifdpn')
    .times(2)
    .reply(404)
    .get('/api/v2/tltc/wallet/5abacebe28d72fbd07e0b8cbba0ff39e/address/Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V')
    .times(4)
    .reply(200, {
      id: '5abacebe28d72fbd07e0b8cf3d571ba8',
      address: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
      chain: 0,
      index: 0,
      coin: 'tltc',
      wallet: '5abacebe28d72fbd07e0b8cbba0ff39e',
      coinSpecific: {
        redeemScript:
          '522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
      },
      balance: {
        updated: '2018-03-27T23:33:10.713Z',
        numTx: 2,
        numUnspents: 0,
        totalReceived: 60000000,
        totalSent: 60000000,
      },
    })
    .get('/api/v2/tbtc/wallet/5abace103cddfbb607d8239d806671bf/address/2N9jq7k8cvFhuucVhhbb8BdWTeEjYxKmSfy')
    .times(7)
    .reply(404)
    .get('/api/v2/tbtc/wallet/5abace103cddfbb607d8239d806671bf/address/2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm')
    .times(7)
    .reply(200, {
      id: '5abace113cddfbb607d823a192372c88',
      address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
      chain: 0,
      index: 0,
      coin: 'tbtc',
      wallet: '5abace103cddfbb607d8239d806671bf',
      coinSpecific: {
        redeemScript:
          '5221032afb7613787f1ab168ae5aea260891a93740a7bd41e66381d73aa07c02e053d321022d342407c7cbe25718d1983db4df95b0000762d9203a35877412d589beebae422103b366f06f3b9f25440d281c78e61aab3375ee8ea4ae72750ac7522c1bdc4e95b153ae',
      },
      balance: {
        updated: '2018-03-27T23:29:42.799Z',
        totalReceived: 65000000,
        totalSent: 65000000,
      },
    })
    .get('/api/v2/tltc/key/5abaceb63cddfbb607d8306521ddf445')
    .reply(200, {
      id: '5abaceb63cddfbb607d8306521ddf445',
      users: ['543c11ed356d00cb7600000b98794503'],
      pub: 'xpub661MyMwAqRbcFkYsn3d9wuVNqYzC2zE45hHZUd2iZM3F5dygCMzxKGhCVB4pjmJ1sWynj1RHQi3iiVoUcrQu2bhzu6GWw9A8ZetxYMTPNdZ',
      ethAddress: '0x04d893e078feecbe10945c9e1b965132e48b2915',
      encryptedPrv:
        '{"iv":"JmWw8SBtiQ80KNGvjHvknA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"+V24Zb2ZpiE=","ct":"JUDBx3xDRuWnlV7LH7Wbt+eUixifofSYjA3kVNUZwRXh+7JIrBfQeCWCvvWopTJi7YgWaM+aLjbXB8mZrrE+14xmFw4evg34De4Omd7vnnbbk2uxe/r+bL7hL3tCz+b6uv9wd/tMQmLyu5PJuIrj5n8gv8SmNn4="}',
    })
    .get('/api/v2/tbtc/key/5abacdffae0ec7c107c7d9cf6d60a886')
    .times(4)
    .reply(200, {
      id: '5abacdffae0ec7c107c7d9cf6d60a886',
      users: ['543c11ed356d00cb7600000b98794503'],
      pub: 'xpub661MyMwAqRbcFSici6moqY283j2hzysM3gSUhBLgAk9r3jM21jw6Lwr3eyxmH6wTbd12KCjBQxmWT5AmVdW3aUvb5zrhYpgdCN7UDC7wYE6',
      ethAddress: '0xfa5f451f8fc1d7084ed40fcfdd414c092e3fbc31',
      encryptedPrv:
        '{"iv":"SqVdgeFwTzb10li5btyiPA==","v":1,"iter":10000,"ks":256,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"yp6P1IYNtAs=","ct":"SHoCHIGD0WyYlieDkgyKTuoaV1VdXIu2rF+XhLAS8fPGWEpj2Lf6Jvjfv+KbUn5CK3OHmWxRB3yjJz8lP1sHgJz68xDh6KnNqEwx5cG8c32+oxN4eEoZZPRrDOq00AHRI6+AtWJgjxGofGfKHE3JEWCZY3C0sBQ="}',
    });

  // Nock explorer info
  nock(env.uri)
    .get('/api/v2/tbtc/public/tx/41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6')
    .times(2)
    .reply(200, {
      id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6',
      normalizedTxHash: '41bc39a36242c76ec13593ec7641196fd9542a9047a8c1964da34f20c6c7ed3f',
      date: '2018-03-27T23:29:42.799Z',
      blockHash: '00000000f94f5c33275ce13a73624c2c0ad19291525154f9560e56e24570f2dc',
      blockHeight: 1289343,
      blockPosition: 45,
      confirmations: 16,
      fee: 1122,
      feeString: '1122',
      size: 370,
      inputIds: ['f6956b431c81108cb3050632540501de8a03501f65bf3b5414235c131005d7f6:0'],
      inputs: [
        {
          id: 'f6956b431c81108cb3050632540501de8a03501f65bf3b5414235c131005d7f6:0',
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          value: 65000000,
          valueString: '65000000',
          redeemScript:
            '5221032afb7613787f1ab168ae5aea260891a93740a7bd41e66381d73aa07c02e053d321022d342407c7cbe25718d1983db4df95b0000762d9203a35877412d589beebae422103b366f06f3b9f25440d281c78e61aab3375ee8ea4ae72750ac7522c1bdc4e95b153ae',
          isSegwit: false,
        },
      ],
      outputs: [
        {
          id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6:0',
          address: '2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx',
          value: 21000000,
          valueString: '21000000',
        },
        {
          id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6:1',
          address: '2NGUBPuroX1yYuKSeownbC3z75o9xttcG1U',
          value: 43998878,
          valueString: '43998878',
        },
        {
          id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6:2',
          address: '2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx',
          value: 100000,
          valueString: '100000',
        },
      ],
      entries: [
        {
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          inputs: 1,
          outputs: 0,
          value: -65000000,
          valueString: '-65000000',
        },
        {
          address: '2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx',
          inputs: 0,
          outputs: 1,
          value: 21000000,
          valueString: '21000000',
        },
        {
          address: '2NGUBPuroX1yYuKSeownbC3z75o9xttcG1U',
          inputs: 0,
          outputs: 1,
          value: 43998878,
          valueString: '43998878',
        },
      ],
    })
    .get('/api/v2/tbtc/public/addressUnspents/2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx')
    .times(4)
    .reply(200, [
      {
        id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6:0',
        address: '2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx',
        value: 21000000,
        valueString: '21000000',
        blockHeight: 1289343,
        date: '2018-03-27T23:29:42.799Z',
      },
      {
        id: '41f5974544068fe91ffa99275a5325ca503b87f11cc04ac74d2ec3390df51bc6:2',
        address: '2N7h1DEEkwvcm1yYiZWsUhwrrLVL4pKgjJx',
        value: 100000,
        valueString: '100000',
        blockHeight: 1289343,
        date: '2018-03-27T23:29:42.799Z',
      },
    ])
    .get('/api/v2/tltc/public/tx/fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39')
    .reply(200, {
      id: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39',
      normalizedTxHash: '1e3a0abd9bae70e9ca9021311076e6bbf7244dc0bc5ac8ac5ab6437cafa6a93a',
      date: '2018-03-27T23:33:10.713Z',
      blockHash: '2e809dc5157b4c1ab6a9ab2d2a291683209013097a31a31262d61b2d7140b9c3',
      blockHeight: 476097,
      blockPosition: 10,
      confirmations: 153,
      fee: 44880,
      feeString: '44880',
      size: 370,
      inputIds: ['78cd1b82384e106aaa8f4c10253211252d3db4807470e83c049db12a2637a967:1'],
      inputs: [
        {
          id: '78cd1b82384e106aaa8f4c10253211252d3db4807470e83c049db12a2637a967:1',
          address: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
          value: 60000000,
          valueString: '60000000',
          redeemScript:
            '522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
          isSegwit: false,
        },
      ],
      outputs: [
        {
          id: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39:0',
          address: 'Qd6bEkzrwMm13oFkKhd9GKwtndBNvv958v',
          value: 19955120,
          valueString: '19955120',
        },
        {
          id: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39:1',
          address: 'QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP',
          value: 40000000,
          valueString: '40000000',
        },
      ],
      entries: [
        {
          address: 'Qd6bEkzrwMm13oFkKhd9GKwtndBNvv958v',
          inputs: 0,
          outputs: 1,
          value: 19955120,
          valueString: '19955120',
        },
        {
          address: 'QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP',
          inputs: 0,
          outputs: 1,
          value: 40000000,
          valueString: '40000000',
        },
        {
          address: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
          inputs: 1,
          outputs: 0,
          value: -60000000,
          valueString: '-60000000',
        },
      ],
    })
    .get('/api/v2/tltc/public/addressUnspents/QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP')
    .reply(200, [
      {
        id: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39:1',
        address: 'QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP',
        value: 40000000,
        valueString: '40000000',
        blockHeight: 476097,
        date: '2018-03-27T23:33:10.713Z',
      },
    ])
    .get('/api/v2/tbch/public/tx/94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26')
    .reply(200, {
      id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26',
      normalizedTxHash: '6346359162b9c42018b8e852e9e5a52ced224bf0c1d55393554472645e2c2dbe',
      date: '2018-03-27T23:34:33.819Z',
      blockHash: '0000000012798d16cefaa7f19b105afe2ea1d4007dd28ca233d65d913a15751c',
      blockHeight: 1222314,
      blockPosition: 4,
      confirmations: 15,
      fee: 5610,
      feeString: '5610',
      size: 370,
      inputIds: ['8f6ab338178e97d3e9a65cd12f4919e8354086cee3d0305ca97d9c96f60043de:0'],
      inputs: [
        {
          id: '8f6ab338178e97d3e9a65cd12f4919e8354086cee3d0305ca97d9c96f60043de:0',
          address: '2NGZbWp6bZto9pFKV1Y5EEGWTNHwgNfpVD2',
          value: 1300000000,
          valueString: '1300000000',
          redeemScript:
            '52210388d574f35d3454b9ed0af9862bc83f9abb2c2c5bec298248f8da9b50fb0fe1d72103fbe5cf926752281de99adc5a42257ad9081178ab46b42a85b7ae76f15f75cf17210346f91ff493951e85008ae28665a1c272ef9e84bfeddca2014bc1cc821c39a87e53ae',
          isSegwit: false,
        },
      ],
      outputs: [
        {
          id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:0',
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          value: 60000000,
          valueString: '60000000',
        },
        {
          id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:1',
          address: '2Mzoz5myftFMQLRGpTdfVv7LXuMpehEXXhF',
          value: 1239994390,
          valueString: '1239994390',
        },
      ],
      entries: [
        {
          address: '2Mzoz5myftFMQLRGpTdfVv7LXuMpehEXXhF',
          inputs: 0,
          outputs: 1,
          value: 1239994390,
          valueString: '1239994390',
        },
        {
          address: '2NGZbWp6bZto9pFKV1Y5EEGWTNHwgNfpVD2',
          inputs: 1,
          outputs: 0,
          value: -1300000000,
          valueString: '-1300000000',
        },
        {
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          inputs: 0,
          outputs: 1,
          value: 60000000,
          valueString: '60000000',
        },
      ],
    })
    .get('/api/v2/tbsv/public/tx/94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26')
    .reply(200, {
      id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26',
      normalizedTxHash: '6346359162b9c42018b8e852e9e5a52ced224bf0c1d55393554472645e2c2dbe',
      date: '2018-03-27T23:34:33.819Z',
      blockHash: '0000000012798d16cefaa7f19b105afe2ea1d4007dd28ca233d65d913a15751c',
      blockHeight: 1222314,
      blockPosition: 4,
      confirmations: 15,
      fee: 5610,
      feeString: '5610',
      size: 370,
      inputIds: ['8f6ab338178e97d3e9a65cd12f4919e8354086cee3d0305ca97d9c96f60043de:0'],
      inputs: [
        {
          id: '8f6ab338178e97d3e9a65cd12f4919e8354086cee3d0305ca97d9c96f60043de:0',
          address: '2NGZbWp6bZto9pFKV1Y5EEGWTNHwgNfpVD2',
          value: 1300000000,
          valueString: '1300000000',
          redeemScript:
            '52210388d574f35d3454b9ed0af9862bc83f9abb2c2c5bec298248f8da9b50fb0fe1d72103fbe5cf926752281de99adc5a42257ad9081178ab46b42a85b7ae76f15f75cf17210346f91ff493951e85008ae28665a1c272ef9e84bfeddca2014bc1cc821c39a87e53ae',
          isSegwit: false,
        },
      ],
      outputs: [
        {
          id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:0',
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          value: 60000000,
          valueString: '60000000',
        },
        {
          id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:1',
          address: '2Mzoz5myftFMQLRGpTdfVv7LXuMpehEXXhF',
          value: 1239994390,
          valueString: '1239994390',
        },
      ],
      entries: [
        {
          address: '2Mzoz5myftFMQLRGpTdfVv7LXuMpehEXXhF',
          inputs: 0,
          outputs: 1,
          value: 1239994390,
          valueString: '1239994390',
        },
        {
          address: '2NGZbWp6bZto9pFKV1Y5EEGWTNHwgNfpVD2',
          inputs: 1,
          outputs: 0,
          value: -1300000000,
          valueString: '-1300000000',
        },
        {
          address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
          inputs: 0,
          outputs: 1,
          value: 60000000,
          valueString: '60000000',
        },
      ],
    })
    .get('/api/v2/tbch/public/addressUnspents/2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm')
    .reply(200, [
      {
        id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:0',
        address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
        value: 60000000,
        valueString: '60000000',
        blockHeight: 1222314,
        date: '2018-03-27T23:34:33.819Z',
      },
    ])
    .get('/api/v2/tbsv/public/addressUnspents/2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm')
    .reply(200, [
      {
        id: '94143c674bd194ea215143457808440aefa4780a2a81396a1f642d6edaa1ea26:0',
        address: '2NF5hJyJxQyRsMjsK6STFagLaoAJNF9M4Zm',
        value: 60000000,
        valueString: '60000000',
        blockHeight: 1222314,
        date: '2018-03-27T23:34:33.819Z',
      },
    ]);
};

const nockEthData: any[] = [
  {
    params: {
      module: 'account',
      action: 'txlist',
      address: '0x74c2137d54b0fc9f907e13f14e0dd18485fee924',
    },
    response: {
      status: '0',
      message: 'No transactions found',
      result: [],
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0x74c2137d54b0fc9f907e13f14e0dd18485fee924',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '100000000000000000',
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0x5df5a96b478bb1808140d87072143e60262e8670',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '2200000000000000000',
    },
  },
  {
    params: {
      module: 'account',
      action: 'txlist',
      address: '0xba6d9d82cf2920c544b834b72f4c6d11a3ef3de6',
    },
    response: {
      status: '0',
      message: 'No transactions found',
      result: [],
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0xba6d9d82cf2920c544b834b72f4c6d11a3ef3de6',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '0',
    },
  },
  {
    params: {
      module: 'account',
      action: 'txlist',
      address: '0x74c2137d54b0fc9f907e13f14e0dd18485fee924',
    },
    response: {
      status: '0',
      message: 'No transactions found',
      result: [],
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0x74c2137d54b0fc9f907e13f14e0dd18485fee924',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '100000000000000000',
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0x5df5a96b478bb1808140d87072143e60262e8670',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '2200000000000000000',
    },
  },
  {
    params: {
      module: 'proxy',
      action: 'eth_call',
      to: '0x5df5a96b478bb1808140d87072143e60262e8670',
      data: 'a0b7967b',
      tag: 'latest',
    },
    response: {
      jsonrpc: '2.0',
      result: '0x0000000000000000000000000000000000000000000000000000000000000001',
      id: 1,
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0xa1a88a502274073b1bc4fe06ea0f5fe77e151b91',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '20000000000000000',
    },
  },
  {
    params: {
      module: 'account',
      action: 'txlist',
      address: '0xa1a88a502274073b1bc4fe06ea0f5fe77e151b91',
    },
    response: {
      status: '1',
      message: 'OK',
      result: [
        {
          blockNumber: '26745364',
          timeStamp: '1628778676',
          hash: '0x41d589b7b12abfad4975f42e62d3b96de1eb9ca477f62b4d5a49b140c3fb6a21',
          nonce: '4',
          blockHash: '0x908c07cc1425e90a0d58e5cc1b109510e14097e04aae741f8de874bfd0f7d87b',
          transactionIndex: '2',
          from: '0x1ce43f2185de5734d3004dd0283f58eaec787e4a',
          to: '0xa1a88a502274073b1bc4fe06ea0f5fe77e151b91',
          value: '20000000000000000',
          gas: '21000',
          gasPrice: '1000000000',
          isError: '0',
          txreceipt_status: '1',
          input: '0x',
          contractAddress: '',
          cumulativeGasUsed: '357536',
          gasUsed: '21000',
          confirmations: '959',
        },
      ],
    },
  },
  {
    params: {
      module: 'account',
      action: 'txlist',
      address: '0xa1a88a502274073b1bc4fe06ea0f5fe77e151b91',
    },
    response: {
      status: '1',
      message: 'OK',
      result: [
        {
          blockNumber: '26745364',
          timeStamp: '1628778676',
          hash: '0x41d589b7b12abfad4975f42e62d3b96de1eb9ca477f62b4d5a49b140c3fb6a21',
          nonce: '4',
          blockHash: '0x908c07cc1425e90a0d58e5cc1b109510e14097e04aae741f8de874bfd0f7d87b',
          transactionIndex: '2',
          from: '0x1ce43f2185de5734d3004dd0283f58eaec787e4a',
          to: '0xa1a88a502274073b1bc4fe06ea0f5fe77e151b91',
          value: '20000000000000000',
          gas: '21000',
          gasPrice: '1000000000',
          isError: '0',
          txreceipt_status: '1',
          input: '0x',
          contractAddress: '',
          cumulativeGasUsed: '357536',
          gasUsed: '21000',
          confirmations: '959',
        },
      ],
    },
  },
  {
    params: {
      module: 'account',
      action: 'tokenbalance',
      contractaddress: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
      address: '0xdf07117705a9f8dc4c2a78de66b7f1797dba9d4e',
      tag: 'latest',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '1000000000000000000',
    },
  },
  {
    params: {
      module: 'proxy',
      action: 'eth_call',
      to: '0xdf07117705a9f8dc4c2a78de66b7f1797dba9d4e',
      data: 'a0b7967b',
      tag: 'latest',
    },
    response: {
      jsonrpc: '2.0',
      result: '0x0000000000000000000000000000000000000000000000000000000000002a7f',
      id: 1,
    },
  },
  {
    params: {
      module: 'account',
      action: 'balance',
      address: '0xdf07117705a9f8dc4c2a78de66b7f1797dba9d4e',
    },
    response: {
      status: '1',
      message: 'OK',
      result: '9999999999999999928',
    },
  },
];

module.exports.nockEthRecovery = function (bitgo, nockData = nockEthData) {
  let apiKey;
  if (Environments[bitgo.getEnv()].etherscanApiToken) {
    apiKey = Environments[bitgo.getEnv()].etherscanApiToken;
  }

  nockData.forEach((data) => {
    if (apiKey) {
      data.params.apiKey = apiKey;
    }
    nock('https://api-kovan.etherscan.io').get('/api').query(data.params).reply(200, data.response);
  });
};

module.exports.nockEtherscanRateLimitError = function () {
  const response = {
    status: '0',
    message: 'NOTOK',
    result: 'Max rate limit reached, rate limit of 3/1sec applied"',
  };

  const params = {
    module: 'account',
    action: 'txlist',
    address: '0x74c2137d54b0fc9f907e13f14e0dd18485fee924',
  };

  nock('https://api-kovan.etherscan.io').get('/api').query(params).reply(200, response);
};

module.exports.nockLtcRecovery = function (isKrsRecovery) {
  nock('http://explorer.litecointools.com/api')
    .get('/addr/QPuiounBxPyL6hsMAjtNtCtjF99uN1Nh6d')
    .reply(200, {
      addrStr: 'QPuiounBxPyL6hsMAjtNtCtjF99uN1Nh6d',
      balance: 0.3,
      balanceSat: 30000000,
      totalReceived: 0.3,
      totalReceivedSat: 30000000,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 1,
      transactions: ['bccfae3c1bdf23cfe0d1b8b195d5c53ac9d939c022a126459dbe7fd96dace4ff'],
    })
    .get('/addr/QPuiounBxPyL6hsMAjtNtCtjF99uN1Nh6d/utxo')
    .reply(200, [
      {
        address: 'QPuiounBxPyL6hsMAjtNtCtjF99uN1Nh6d',
        txid: 'bccfae3c1bdf23cfe0d1b8b195d5c53ac9d939c022a126459dbe7fd96dace4ff',
        vout: 0,
        scriptPubKey: 'a914244317d159e267430432b351b6884f93b11e618a87',
        amount: 0.3,
        satoshis: 30000000,
        height: 481308,
        confirmations: 10,
      },
    ])
    .get('/addr/QditoGqT6fJQfnYTrqeeHyxC7ECJsmmu9p')
    .reply(200, {
      addrStr: 'QditoGqT6fJQfnYTrqeeHyxC7ECJsmmu9p',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/Qhc4ZSNeFZS5XGSUKsG3RXkbMJmEQjuCKr')
    .reply(200, {
      addrStr: 'Qhc4ZSNeFZS5XGSUKsG3RXkbMJmEQjuCKr',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QS8WRomtKcPvVqYcqjWCZsgqrtGmuCk4Jo')
    .reply(200, {
      addrStr: 'QS8WRomtKcPvVqYcqjWCZsgqrtGmuCk4Jo',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QX7xxCB4tJGimxcoXpjCjfL2wMwK2qktmu')
    .reply(200, {
      addrStr: 'QX7xxCB4tJGimxcoXpjCjfL2wMwK2qktmu',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QMvx45J6TizqRvPVZS3Er8LEUS61ZewtfU')
    .reply(200, {
      addrStr: 'QMvx45J6TizqRvPVZS3Er8LEUS61ZewtfU',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QaoQyigiGoieEfzjDLUmSNAimfvB3BKcRG')
    .reply(200, {
      addrStr: 'QaoQyigiGoieEfzjDLUmSNAimfvB3BKcRG',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QMqVDa2JyjT4homMjyPjKT93PZQ3ab2nDq')
    .reply(200, {
      addrStr: 'QMqVDa2JyjT4homMjyPjKT93PZQ3ab2nDq',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QTGrp5u5YzPjvcHLj3K6pmwFA7fuGJ67oL')
    .reply(200, {
      addrStr: 'QTGrp5u5YzPjvcHLj3K6pmwFA7fuGJ67oL',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/Qd7dXKNeDS6T9jMEVnj9CvawqFk6af4con')
    .reply(200, {
      addrStr: 'Qd7dXKNeDS6T9jMEVnj9CvawqFk6af4con',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/QRgh4mCr3JXwc1N6xyAx6aguytWz4KjDTW')
    .reply(200, {
      addrStr: 'QRgh4mCr3JXwc1N6xyAx6aguytWz4KjDTW',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/tx/fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39')
    .reply(200, {
      txid: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39',
      version: 1,
      locktime: 476097,
      vin: [
        {
          txid: '78cd1b82384e106aaa8f4c10253211252d3db4807470e83c049db12a2637a967',
          vout: 1,
          sequence: 4294967295,
          n: 0,
          scriptSig: {
            hex: '004730440220752f19ce5d6ce6de28f6c2d42d72e36528e54b4229b7e7b2626dc6edbec144280220714dc421c2955cc122322a558484d34dd3cec0605b1775c167724bf1a63e4a6b01483045022100d98444b2158abfe6310592382af67333a1853525fde049686e47c43874f91e0402200775c62b5d07751ca049a3ae7e580b37ce8a3c037e9aa81bcabec939f20eda32014c69522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
            asm: '0 30440220752f19ce5d6ce6de28f6c2d42d72e36528e54b4229b7e7b2626dc6edbec144280220714dc421c2955cc122322a558484d34dd3cec0605b1775c167724bf1a63e4a6b[ALL] 3045022100d98444b2158abfe6310592382af67333a1853525fde049686e47c43874f91e0402200775c62b5d07751ca049a3ae7e580b37ce8a3c037e9aa81bcabec939f20eda32[ALL] 522103b31347f19510acbc7f50822ac4093ca80554946c471b43eb937d0c9118d1122d2102cd3787d12af6eb87e7b9af00118a225e2ce663a5c94f555460ae131139a2afee2103bd558669de622fc57a8157f449c52254218dbc40dedf047891192bdd013cad8953ae',
          },
          addr: 'Qb3mLF6zy2frAAJmBcuVneJHUsmtk2Jo6V',
          valueSat: 60000000,
          value: 0.6,
          doubleSpentTxID: null,
        },
      ],
      vout: [
        {
          value: '0.19955120',
          n: 0,
          scriptPubKey: {
            hex: 'a914b4eafbbe60824ec918f76a4b4a97f331a5d6be2087',
            asm: 'OP_HASH160 b4eafbbe60824ec918f76a4b4a97f331a5d6be20 OP_EQUAL',
            addresses: ['Qd6bEkzrwMm13oFkKhd9GKwtndBNvv958v'],
            type: 'scripthash',
          },
          spentTxId: '4bab9c6238f390c113fb10f2e3a4580c90f956a782feab581640516a94918c15',
          spentIndex: 0,
          spentHeight: 610500,
        },
        {
          value: '0.40000000',
          n: 1,
          scriptPubKey: {
            hex: 'a914ef856a40c6dc109591b7d4fad170986d0bb404af87',
            asm: 'OP_HASH160 ef856a40c6dc109591b7d4fad170986d0bb404af OP_EQUAL',
            addresses: ['QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP'],
            type: 'scripthash',
          },
          spentTxId: null,
          spentIndex: null,
          spentHeight: null,
        },
      ],
      blockhash: '2e809dc5157b4c1ab6a9ab2d2a291683209013097a31a31262d61b2d7140b9c3',
      blockheight: 476097,
      confirmations: 1487867,
      time: 1522193720,
      blocktime: 1522193720,
      valueOut: 0.5995512,
      size: 370,
      valueIn: 0.6,
      fees: 0.0004488,
    })
    .get('/addrs/QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP/utxo')
    .reply(200, [
      {
        address: 'QiSTRzBCS5UxVvdMiYVGfNn1wYkC9JrpmP',
        txid: 'fe22e43e7894e91ec4b371bfbce02f49b2903cc535e4a2345eeda5271c81db39',
        vout: 1,
        scriptPubKey: 'a914ef856a40c6dc109591b7d4fad170986d0bb404af87',
        amount: 0.4,
        satoshis: 40000000,
        height: 476097,
        confirmations: 1497700,
      },
    ]);

  if (isKrsRecovery) {
    // unnecessary market data removed
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=litecoin&vs_currencies=USD')
      .reply(200, {
        litecoin: {
          usd: 1000,
        },
      });
  }
};

module.exports.nockZecRecovery = function (bitgo, isKrsRecovery) {
  const env = Environments[bitgo.getEnv()] as Environment;
  nock(env.zecExplorerBaseUrl)
    .get('/addr/t2PDm4QH9x8gxGvfKHnHCksZMs5ee94M3BS')
    .reply(200, {
      addrStr: 't2PDm4QH9x8gxGvfKHnHCksZMs5ee94M3BS',
      balance: 0.3,
      balanceSat: 30000000,
      totalReceived: 0.3,
      totalReceivedSat: 30000000,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 1,
      transactions: ['754975f7a113e8fa5ae395a350b93514c2096cae4c16be2dd827d8a451e6890f'],
    })
    .get('/addr/t2PDm4QH9x8gxGvfKHnHCksZMs5ee94M3BS/utxo')
    .reply(200, [
      {
        address: 't2PDm4QH9x8gxGvfKHnHCksZMs5ee94M3BS',
        txid: '754975f7a113e8fa5ae395a350b93514c2096cae4c16be2dd827d8a451e6890f',
        vout: 0,
        scriptPubKey: 'a914b6dfccf23872e01a01d746dbf063730887d4457f87',
        amount: 0.3,
        satoshis: 30000000,
        height: 260745,
        confirmations: 3,
      },
    ])
    .get('/addr/t2HKLixbkdGCJBKvfknMF9Bz4k4nTkUXwNJ')
    .reply(200, {
      addrStr: 't2HKLixbkdGCJBKvfknMF9Bz4k4nTkUXwNJ',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2UQsXsYj1ViDGLKbyHAFNpSzEJmfggq9n1')
    .reply(200, {
      addrStr: 't2UQsXsYj1ViDGLKbyHAFNpSzEJmfggq9n1',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2KmVCRvzBcmDaNLgUnSx4BUJTzLWT7EGTG')
    .reply(200, {
      addrStr: 't2KmVCRvzBcmDaNLgUnSx4BUJTzLWT7EGTG',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2UkU8n1FhZKs5dP8cSogKJtSb9AuVZhRh4')
    .reply(200, {
      addrStr: 't2UkU8n1FhZKs5dP8cSogKJtSb9AuVZhRh4',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2KNfjD9RLrnyadU83zJvgLaRowGEojstbJ')
    .reply(200, {
      addrStr: 't2KNfjD9RLrnyadU83zJvgLaRowGEojstbJ',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t27tCPuhsuS2fB89TAxVuLTfYcL6Gbqk9zD')
    .reply(200, {
      addrStr: 't27tCPuhsuS2fB89TAxVuLTfYcL6Gbqk9zD',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2P2TaEYseCb6FYz8mgzAuSpy89txz4cEGh')
    .reply(200, {
      addrStr: 't2P2TaEYseCb6FYz8mgzAuSpy89txz4cEGh',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2Br6W3MSa32Esd3xr5whZoK5McattTTqMB')
    .reply(200, {
      addrStr: 't2Br6W3MSa32Esd3xr5whZoK5McattTTqMB',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t28kz5GJ5GkjK3iWPNkHgssFGeJ58MngaJK')
    .reply(200, {
      addrStr: 't28kz5GJ5GkjK3iWPNkHgssFGeJ58MngaJK',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/t2MxFfe497FetSzqLomcQ6JLxWPsgkdnLWe')
    .reply(200, {
      addrStr: 't2MxFfe497FetSzqLomcQ6JLxWPsgkdnLWe',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    });

  if (isKrsRecovery) {
    // unnecessary market data removed
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=zcash&vs_currencies=USD')
      .reply(200, {
        zcash: {
          usd: 1000,
        },
      });
  }
};

module.exports.nockDashRecovery = function (bitgo, isKrsRecovery) {
  const env = Environments[bitgo.getEnv()] as Environment;
  nock(env.dashExplorerBaseUrl)
    .get('/addr/8sAnaiWbJnznfRwrtJt2UqwShN6WtCc4wW')
    .reply(200, {
      addrStr: '8sAnaiWbJnznfRwrtJt2UqwShN6WtCc4wW',
      balance: 0.1,
      balanceSat: 10000000,
      totalReceived: 0.1,
      totalReceivedSat: 10000000,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 1,
      transactions: ['53fdc68a122288214c1ccedbf49bdb1a39220eacc1ac1cf0407103927a67daed'],
    })
    .get('/addr/8sAnaiWbJnznfRwrtJt2UqwShN6WtCc4wW/utxo')
    .reply(200, [
      {
        address: '8sAnaiWbJnznfRwrtJt2UqwShN6WtCc4wW',
        txid: '53fdc68a122288214c1ccedbf49bdb1a39220eacc1ac1cf0407103927a67daed',
        vout: 1,
        scriptPubKey: 'a9148bd32681a9c8a6ed07fccf499e22267db8ce0c6987',
        amount: 0.1,
        satoshis: 10000000,
        height: 224276,
        confirmations: 1,
      },
    ])
    .get('/addr/8fKrinrA9f6ipbJZZZ5dcBzbP5GDtwfeAw')
    .reply(200, {
      addrStr: '8fKrinrA9f6ipbJZZZ5dcBzbP5GDtwfeAw',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/8ktwroXmaNqbvTnrmiQrPCCBrFcVBUn5DL')
    .reply(200, {
      addrStr: '8ktwroXmaNqbvTnrmiQrPCCBrFcVBUn5DL',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/8sVHyDTpJ6iYtUBpdjv5Xx7wMvaUxDtFbZ')
    .reply(200, {
      addrStr: '8sVHyDTpJ6iYtUBpdjv5Xx7wMvaUxDtFbZ',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/8vwsgS5ykkd257WAk8Xk9jfyTfCaPukh1k')
    .reply(200, {
      addrStr: '8vwsgS5ykkd257WAk8Xk9jfyTfCaPukh1k',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/8wwFXCuu6URcYXxvtYxmMBUqUuSGcGw6bn')
    .reply(200, {
      addrStr: '8wwFXCuu6URcYXxvtYxmMBUqUuSGcGw6bn',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    })
    .get('/addr/8n9g7B3daAPaBGohTziTAfsqNxoM2jqao3')
    .reply(200, {
      addrStr: '8n9g7B3daAPaBGohTziTAfsqNxoM2jqao3',
      balance: 0,
      balanceSat: 0,
      totalReceived: 0,
      totalReceivedSat: 0,
      totalSent: 0,
      totalSentSat: 0,
      unconfirmedBalance: 0,
      unconfirmedBalanceSat: 0,
      unconfirmedTxApperances: 0,
      txApperances: 0,
      transactions: [],
    });

  if (isKrsRecovery) {
    // unnecessary market data removed
    nock('https://api.coingecko.com')
      .get('/api/v3/simple/price?ids=dash&vs_currencies=USD')
      .reply(200, {
        dash: {
          usd: 1000,
        },
      });
  }
};

module.exports.nockXlmRecovery = function () {
  nock('https://horizon-testnet.stellar.org')
    .get('/accounts/GAGCQLUGMX76XC24JRCRJWOHXK23ONURH4433JOEPU6CH7Z44CCYUCEL')
    .reply(404, {
      status: 404,
    })
    .get('/accounts/GASW277S2ZOE7H7A5EQ5H5AKLP6UA6Z5AKOSWV6ARBEGTSIGMZMC7AIZ')
    .reply(200, {
      balance: '10',
    })
    .get('/accounts/GAUAGTL3NBZ7NP3UIMZCVJYM6O2NKUP6XRTK4E5VZDVIQX3CBYIVMDIB')
    .reply(200, {
      id: 'GAUAGTL3NBZ7NP3UIMZCVJYM6O2NKUP6XRTK4E5VZDVIQX3CBYIVMDIB',
      paging_token: '',
      account_id: 'GAUAGTL3NBZ7NP3UIMZCVJYM6O2NKUP6XRTK4E5VZDVIQX3CBYIVMDIB',
      sequence: '47339455954026497',
      subentry_count: 3,
      thresholds: {
        low_threshold: 1,
        med_threshold: 2,
        high_threshold: 3,
      },
      flags: {
        auth_required: false,
        auth_revocable: false,
      },
      balances: [
        {
          balance: '9.9999600',
          buying_liabilities: '0.0000000',
          selling_liabilities: '0.0000000',
          asset_type: 'native',
        },
      ],
      signers: [
        {
          public_key: 'GBNK4FJO6FDQNBVLUP7MICEJUVINPNJZCDDTTYS3LVFC6J7LKEXLOBKM',
          weight: 1,
          key: 'GBNK4FJO6FDQNBVLUP7MICEJUVINPNJZCDDTTYS3LVFC6J7LKEXLOBKM',
          type: 'ed25519_public_key',
        },
        {
          public_key: 'GCBABJPE3UTZ3JPUEIZEXAQQ5CMNX5UPYKOB7HHXSHBCIGD7VV64H6KU',
          weight: 1,
          key: 'GCBABJPE3UTZ3JPUEIZEXAQQ5CMNX5UPYKOB7HHXSHBCIGD7VV64H6KU',
          type: 'ed25519_public_key',
        },
        {
          public_key: 'GBSKZM7HG4S2W4N4H65XHTGS724HQA7EFMSSCVLPWW53ZFL6SNVFJKJO',
          weight: 1,
          key: 'GBSKZM7HG4S2W4N4H65XHTGS724HQA7EFMSSCVLPWW53ZFL6SNVFJKJO',
          type: 'ed25519_public_key',
        },
        {
          public_key: 'GAUAGTL3NBZ7NP3UIMZCVJYM6O2NKUP6XRTK4E5VZDVIQX3CBYIVMDIB',
          weight: 0,
          key: 'GAUAGTL3NBZ7NP3UIMZCVJYM6O2NKUP6XRTK4E5VZDVIQX3CBYIVMDIB',
          type: 'ed25519_public_key',
        },
      ],
      data: {},
    })
    .get('/ledgers')
    .query(true)
    .times(2)
    .reply(200, {
      _links: {
        self: {
          href: 'https://horizon-testnet.stellar.org/ledgers?c=0.37643100613718006&cursor=&limit=1&order=desc',
        },
        next: {
          href: 'https://horizon-testnet.stellar.org/ledgers?c=0.37643100613718006&cursor=48419653113872384&limit=1&order=desc',
        },
        prev: {
          href: 'https://horizon-testnet.stellar.org/ledgers?c=0.37643100613718006&cursor=48419653113872384&limit=1&order=asc',
        },
      },
      _embedded: {
        records: [
          {
            _links: {
              self: {
                href: 'https://horizon-testnet.stellar.org/ledgers/11273579',
              },
              transactions: {
                href: 'https://horizon-testnet.stellar.org/ledgers/11273579/transactions{?cursor,limit,order}',
                templated: true,
              },
              operations: {
                href: 'https://horizon-testnet.stellar.org/ledgers/11273579/operations{?cursor,limit,order}',
                templated: true,
              },
              payments: {
                href: 'https://horizon-testnet.stellar.org/ledgers/11273579/payments{?cursor,limit,order}',
                templated: true,
              },
              effects: {
                href: 'https://horizon-testnet.stellar.org/ledgers/11273579/effects{?cursor,limit,order}',
                templated: true,
              },
            },
            id: '5fab170a47afa15cc130790f8c3bcb846fa295b1fa51139437c4d120878e850f',
            paging_token: '48419653113872384',
            hash: '5fab170a47afa15cc130790f8c3bcb846fa295b1fa51139437c4d120878e850f',
            prev_hash: '5efe6f32662af8ab2d8a5f8984c027ad330f181bf5b9e3812d5a08f62e2cb978',
            sequence: 11273579,
            transaction_count: 0,
            operation_count: 0,
            closed_at: '2018-09-27T22:13:35Z',
            total_coins: '104284715255.7420028',
            fee_pool: '1708880873.6769687',
            base_fee_in_stroops: 100,
            base_reserve_in_stroops: 5000000,
            max_tx_set_size: 50,
            protocol_version: 10,
            header_xdr:
              'AAAACl7+bzJmKvirLYpfiYTAJ60zDxgb9bnjgS1aCPYuLLl4NB4MFpS0jQk8X3Ut93c2Q7cYEEWnhZ3tteMhZnztSM8AAAAAW61WDwAAAAAAAAAALzWviJxVDV+wrzVnS4YoI8xI050aKnAfney+tZxfcY2aFysDFVMF16cqgZjw8yiyzyfc1u0eqpLtLrZyYEam/ACsBWsOeO/1wzZt/AA8ti5WY8aXAAAA3QAAAAAAC4SRAAAAZABMS0AAAAAyuglBsLFyGmBOqJ250fDa76bY5/c1v9TBQl0ALhzx2G6vXcdZSm8aoCBPWHZBrK7GfpHa4DbiDqIav4yzjanIUSJ9CWKlXQXHWff9yKUlpaVJJy4TcELJV3w0nlwaNbRzLf+JwGVYb6BnB2GiZESvf1yEibvlU21ZVeEBsccbkg4AAAAA',
          },
        ],
      },
    });
};

module.exports.nockTronRecovery = function () {
  // full node - sendTrx from tronweb, build transaction call
  nock('http://47.252.81.135:8090')
    .post('/wallet/createtransaction')
    .reply(200, {
      visible: false,
      txID: '55d76a068b97933a98e5d02e6fecd4c2971f1d37f0bb850a919b17def906a239',
      raw_data: {
        contract: [
          {
            parameter: {
              value: {
                amount: 899000000,
                owner_address: '414d0941161d0f7e1da0c8989b1566c9d9b43e1226',
                to_address: '41f3a3d6d514e7d43fbbf632a687acd65aafb8a50c',
              },
              type_url: 'type.googleapis.com/protocol.TransferContract',
            },
            type: 'TransferContract',
          },
        ],
        ref_block_bytes: '3ffb',
        ref_block_hash: 'c1647593403d263b',
        expiration: 1574098803000,
        timestamp: 1574098744605,
      },
      raw_data_hex:
        '0a023ffb2208c1647593403d263b40b8b2e6fce72d5a69080112650a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412340a15414d0941161d0f7e1da0c8989b1566c9d9b43e1226121541f3a3d6d514e7d43fbbf632a687acd65aafb8a50c18c0cdd6ac03709deae2fce72d',
    });

  // solidity node - retrieve account information call
  nock('http://47.252.81.135:8091')
    // this address is equal to TGzY7ps8orxQ24yY2YyoJertyrjdWUEU4E
    .post(`/walletsolidity/getaccount`)
    .reply(200, {
      address: '414d0941161d0f7e1da0c8989b1566c9d9b43e1226',
      balance: 900000000,
      create_time: 1573831677000,
      latest_opration_time: 1573831692000,
      free_net_usage: 431,
      latest_consume_free_time: 1573831692000,
      account_resource: {},
      owner_permission: {
        permission_name: 'owner',
        threshold: 2,
        keys: [
          { address: '414d0941161d0f7e1da0c8989b1566c9d9b43e1226', weight: 1 },
          { address: '41ea340b1c5806fa6fa45d7d4ec84ff84b6a5478bc', weight: 1 },
          { address: '41b93c8db3137395f68243611e79aceb158f4a51df', weight: 1 },
        ],
      },
      active_permission: [
        {
          type: 'Active',
          id: 2,
          permission_name: 'active0',
          threshold: 2,
          operations: '7fff1fc0037e0000000000000000000000000000000000000000000000000000',
          keys: [
            { address: '414d0941161d0f7e1da0c8989b1566c9d9b43e1226', weight: 1 },
            { address: '41ea340b1c5806fa6fa45d7d4ec84ff84b6a5478bc', weight: 1 },
            { address: '41b93c8db3137395f68243611e79aceb158f4a51df', weight: 1 },
          ],
        },
      ],
    });
};

module.exports.nockEosRecovery = function () {
  nock('https://jungle3.cryptolions.io:443').post('*').reply(502);
  nock('https://jungle3.eosdac.io:443')
    .post('/v1/chain/get_info')
    .reply(200, {
      server_version: '14185431',
      chain_id: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
      head_block_num: 39752030,
      last_irreversible_block_num: 39751705,
      last_irreversible_block_id: '025e90194fbe7ba5773af4b3ed099aaed0fb26b8f7750e414ea0ee975a04cdc1',
      head_block_id: '025e915eff653f4ad408e1b36e40f6b4d842afde81672446f91ca1e615ebf03c',
      head_block_time: '2019-07-18T17:52:49.000',
      head_block_producer: 'eosnationftw',
      virtual_block_cpu_limit: 200000000,
      virtual_block_net_limit: 524288000,
      block_cpu_limit: 199900,
      block_net_limit: 524288,
      server_version_string: 'v1.8.1',
      fork_db_head_block_num: 39752030,
      fork_db_head_block_id: '025e915eff653f4ad408e1b36e40f6b4d842afde81672446f91ca1e615ebf03c',
    })
    .post('/v1/chain/get_block', { block_num_or_id: 39752030 })
    .reply(200, {
      timestamp: '2019-07-18T17:52:49.000',
      producer: 'eosnationftw',
      confirmed: 0,
      previous: '025e915dcf7ce855a5818f17c78f3bedc16bfa505aa8d27b26860fe875112e5e',
      transaction_mroot: '0000000000000000000000000000000000000000000000000000000000000000',
      action_mroot: 'd71fc942fb9fcd337692f037d3fb967d76ddd2b30bae40450d1feef50f56ceec',
      schedule_version: 245,
      new_producers: null,
      header_extensions: [],
      producer_signature:
        'SIG_K1_JwDWGq1SxPHw5xTwUzZ1Hf4YCdvzsYvAoh9nNvGXjyXjk57pLb5fc8in3vop9h1mMdZtsRhEYa4bV9P4fMvHXcqiFjw83y',
      transactions: [],
      block_extensions: [],
      id: '025e915eff653f4ad408e1b36e40f6b4d842afde81672446f91ca1e615ebf03c',
      block_num: 39752030,
      ref_block_prefix: 3017869524,
    })
    .post('/v1/chain/get_account', { account_name: 'jzjkpn1bjnti' })
    .reply(200, {
      account_name: 'jzjkpn1bjnti',
      head_block_num: 39739576,
      head_block_time: '2019-07-18T16:08:34.500',
      privileged: false,
      last_code_update: '1970-01-01T00:00:00.000',
      created: '2019-07-18T12:52:10.000',
      core_liquid_balance: '99.0000 EOS',
      ram_quota: 9586,
      net_weight: 0,
      cpu_weight: 0,
      net_limit: {
        used: 161,
        available: 0,
        max: 0,
      },
      cpu_limit: {
        used: 419,
        available: 0,
        max: 0,
      },
      ram_usage: 3324,
      permissions: [
        {
          perm_name: 'active',
          parent: 'owner',
          required_auth: {
            threshold: 2,
            keys: [
              {
                key: 'EOS5ecwm5UH1b2ggGJTq5r1aqd1cgKsi3NUYPJbLakana57E1anP2',
                weight: 1,
              },
              {
                key: 'EOS5oyoziJUH2u3KJu9fUFmahrkMC1x86hdBs5768tA9N3R7zENHx',
                weight: 1,
              },
              {
                key: 'EOS6dZzCHfSVGGjJ9VegMpu9utsNERqrmnwoEntQcgfCUyyuciQm9',
                weight: 1,
              },
            ],
            accounts: [],
            waits: [],
          },
        },
        {
          perm_name: 'owner',
          parent: '',
          required_auth: {
            threshold: 2,
            keys: [
              {
                key: 'EOS5ecwm5UH1b2ggGJTq5r1aqd1cgKsi3NUYPJbLakana57E1anP2',
                weight: 1,
              },
              {
                key: 'EOS5oyoziJUH2u3KJu9fUFmahrkMC1x86hdBs5768tA9N3R7zENHx',
                weight: 1,
              },
              {
                key: 'EOS6dZzCHfSVGGjJ9VegMpu9utsNERqrmnwoEntQcgfCUyyuciQm9',
                weight: 1,
              },
            ],
            accounts: [],
            waits: [],
          },
        },
      ],
      total_resources: {
        owner: 'jzjkpn1bjnti',
        net_weight: '0.0000 EOS',
        cpu_weight: '0.0000 EOS',
        ram_bytes: 8186,
      },
      self_delegated_bandwidth: null,
      refund_request: null,
      voter_info: null,
    })
    .post('/v1/chain/get_account', { account_name: 'kiyjcn1ixftp' })
    .reply(200, {
      account_name: 'kiyjcn1ixftp',
      head_block_num: 39739505,
      head_block_time: '2019-07-18T16:07:59.000',
      privileged: false,
      last_code_update: '1970-01-01T00:00:00.000',
      created: '2019-07-18T15:57:05.500',
      core_liquid_balance: '100.0000 EOS',
      ram_quota: 9587,
      net_weight: 0,
      cpu_weight: 0,
      net_limit: {
        used: 0,
        available: 0,
        max: 0,
      },
      cpu_limit: {
        used: 0,
        available: 0,
        max: 0,
      },
      ram_usage: 3196,
      permissions: [
        {
          perm_name: 'active',
          parent: 'owner',
          required_auth: {
            threshold: 2,
            keys: [
              {
                key: 'EOS5sxRZCyaKAowNZBVrAvUHYQioMXf8Qru7XADoJwr53iFDJPsGC',
                weight: 1,
              },
              {
                key: 'EOS64hsH9DiP1eSQuYKEaFD5SQp4cLRPvTYaCUvV2AfcWBVy7CjjN',
                weight: 1,
              },
              {
                key: 'EOS741DEx6Gstbi2cdmQyjGrBi8rndGeSBw7hM5uYiKft2ptmKRgd',
                weight: 1,
              },
            ],
            accounts: [],
            waits: [],
          },
        },
        {
          perm_name: 'owner',
          parent: '',
          required_auth: {
            threshold: 2,
            keys: [
              {
                key: 'EOS5sxRZCyaKAowNZBVrAvUHYQioMXf8Qru7XADoJwr53iFDJPsGC',
                weight: 1,
              },
              {
                key: 'EOS64hsH9DiP1eSQuYKEaFD5SQp4cLRPvTYaCUvV2AfcWBVy7CjjN',
                weight: 1,
              },
              {
                key: 'EOS741DEx6Gstbi2cdmQyjGrBi8rndGeSBw7hM5uYiKft2ptmKRgd',
                weight: 1,
              },
            ],
            accounts: [],
            waits: [],
          },
        },
      ],
      total_resources: {
        owner: 'kiyjcn1ixftp',
        net_weight: '0.0000 EOS',
        cpu_weight: '0.0000 EOS',
        ram_bytes: 8187,
      },
      self_delegated_bandwidth: null,
      refund_request: null,
      voter_info: null,
    });
};

module.exports.nockEmptyAddressInfo = function (emptyAddrs: Array<string>, env: any) {
  emptyAddrs.forEach(function (addr) {
    const data = {};
    data[addr] = {
      address: {
        type: null,
        script_hex: '',
        balance: 0,
        balance_usd: 0,
        received: 0,
        received_usd: 0,
        spent: 0,
        spent_usd: 0,
        output_count: 0,
        unspent_output_count: 0,
        first_seen_receiving: null,
        last_seen_receiving: null,
        first_seen_spending: null,
        last_seen_spending: null,
        scripthash_type: null,
        transaction_count: 0,
      },
      transactions: [],
      utxo: [],
    };
    nock(BlockchairApi.getBaseUrl(env, 'bitcoin'))
      .get('/dashboards/address/' + addr)
      .reply(200, {
        data: data,
        blockchairContext,
      });
  });
};

module.exports.nockBtcSegwitRecovery = function (bitgo) {
  const env = bitgo.getEnv() as any;
  const emptyAddrs = [
    '2N42muVaEhvcyMRr7pmFPnrmprdmWCUvhy7',
    '2N2b2yNryWVbMjvXFq7RbaQ2xbGhmAuBQM7',
    '2NBs5i2APw3XSvfch7rHirYC6AxehYizCU9',
    '2NEFHeSYnHVt4t2KqwKz1AZqhpcx2yGoe38',
    '2N4iR1AweHV8wmc7VPBb3tRnweQs1fSW3dB',
    '2N1ir7htudeFEWGhyfXGL7LNKzoFrDS62bQ',
    '2NBpZak1Tz1cpLhg6ZapeTSHkhq91GwMYFo',
    '2N93AW6R6eLan8rfB715oCse9P6pexfK3Tn',
    '2NEZiLrBnTSrwNuVuKCXcAi9AL6YSr1FYqY',
  ];
  this.nockEmptyAddressInfo(emptyAddrs, env);
  nock(BlockchairApi.getBaseUrl(env, 'bitcoin'))
    .get('/dashboards/address/2N7kMMaUjmBYCiZqQV7GDJhBSnJuJoTuBws') // unspent
    .times(2)
    .reply(200, {
      data: {
        '2N7kMMaUjmBYCiZqQV7GDJhBSnJuJoTuBws': {
          address: {
            type: 'scripthash',
            script_hex: 'a9149f13f940a9461ac6e5393859faca8c513f93cd6e87',
            balance: 20000,
            balance_usd: 0,
            received: 20000,
            received_usd: 0,
            spent: 20000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-16 23:52:45',
            last_seen_receiving: '2019-01-16 23:52:45',
            first_seen_spending: '2019-01-17 02:27:18',
            last_seen_spending: '2019-01-17 02:27:18',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            '0f58644f28726159e833c2b4dbf7a46be2c0eb7f8d36c244bca765b05113880a',
            '9a57cdf7a8ce94c1cdad90f639fd8dcab8d20f68a117a7c30dbf468652fbf7e0',
          ],
          utxo: [
            {
              block_id: 643436,
              transaction_hash: '9a57cdf7a8ce94c1cdad90f639fd8dcab8d20f68a117a7c30dbf468652fbf7e0',
              index: 0,
              value: 20000,
            },
          ],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MwvWgPCe6Ev9ikkXzidYB5WQqmhdfWMyVp') // unspent
    .times(2)
    .reply(200, {
      data: {
        '2MwvWgPCe6Ev9ikkXzidYB5WQqmhdfWMyVp': {
          address: {
            type: 'scripthash',
            script_hex: 'a914334ea8adc3423478229444603ab27f02de2550ef87',
            balance: 20000,
            balance_usd: 0,
            received: 41000,
            received_usd: 0,
            spent: 41000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-16 23:52:45',
            last_seen_receiving: '2019-01-16 23:52:45',
            first_seen_spending: '2019-01-17 02:27:18',
            last_seen_spending: '2019-01-17 02:27:18',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            '0f58644f28726159e833c2b4dbf7a46be2c0eb7f8d36c244bca765b05113880a',
            '8040382653ee766f6c82361c8a19b333702fbb3faabc87e7b5fa0d6c9b8aa387',
          ],
          utxo: [
            // I added this
            {
              block_id: -1, // TODO, this is not a real value but probably doesnt matter
              transaction_hash: '8040382653ee766f6c82361c8a19b333702fbb3faabc87e7b5fa0d6c9b8aa387',
              index: 1,
              value: 41000,
            },
          ],
        },
      },
      blockchairContext,
    });

  nock('https://mempool.space')
    .get('/api/v1/fees/recommended')
    .reply(200, { fastestFee: 20, halfHourFee: 20, hourFee: 6 });
};

module.exports.nockBtcUnsignedRecovery = function (bitgo) {
  const env = bitgo.getEnv() as any;
  const emptyAddrs = [
    '2NAmqGejm1YYiE8rUVanU8SsUkUxqJmKhT3',
    '2MyVwQPE9sM16SCCRa2crUfC1t1bmk92aub',
    '2N6iwcgjTmBZF9MXv32Fw2pkASmBxxPr4qB',
    '2N2h5xreaUWTwqTZeeQ5wbWNhKTopRqKkSe',
    '2NBRHTmnc1RCCnYeo6iS4SnBTVKnnf86vAV',
    '2N6xcb27jLdCZSNegtZzUVKHHJynKiEfhQo',
    '2N1jYERmv9Bpx9z123n3YF8Darepv8PU9tY',
    '2N29zwEk5AbcCW2wUWZoxsqh8Tb39ymHGvu',
    '2N2PppF9zw1jxM26VG89NjUA8bFWUPr8vjF',
  ];
  this.nockEmptyAddressInfo(emptyAddrs, env);

  nock(BlockchairApi.getBaseUrl(env, 'bitcoin'))
    .get('/dashboards/address/2N8cRxMypLRN3HV1ub3b9mu1bbBRYA4JTNx')
    .reply(200, {
      data: {
        '2N8cRxMypLRN3HV1ub3b9mu1bbBRYA4JTNx': {
          address: {
            type: 'scripthash',
            script_hex: 'a914a88c9c8472b5facb5142062ec6b4d6a9fd5d2c7b87',
            balance: 0,
            balance_usd: 0,
            received: 100000,
            received_usd: 0,
            spent: 100000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-24 21:32:01',
            last_seen_receiving: '2019-01-24 21:32:01',
            first_seen_spending: '2019-01-24 22:59:05',
            last_seen_spending: '2019-01-24 22:59:05',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            'c4b15cf8d09a37d2361184cfa10678ea79a83f5455c78d69267238c8b351959e',
            'a51944691864fdebd0af5fe0927cf15faeec4f99167dc4ed667939f39b182dfc',
          ],
          utxo: [],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2MxZA7JFtNiQrET7JvywDisrZnKPEDAHf49')
    .times(2)
    .reply(200, {
      data: {
        '2MxZA7JFtNiQrET7JvywDisrZnKPEDAHf49': {
          address: {
            type: 'scripthash',
            script_hex: 'a9143a3ce0cea3510e6435823a7d3c5a7c3c27166f2d87',
            balance: 100000,
            balance_usd: 0,
            received: 100000,
            received_usd: 0,
            spent: 100000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-24 22:59:05',
            last_seen_receiving: '2019-01-24 22:59:05',
            first_seen_spending: '2019-01-24 23:46:50',
            last_seen_spending: '2019-01-24 23:46:50',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            'aec04f5ebdde076ea87d2ab320d95526ecc63590488f456b29c208001bc262f8',
            '4bf4a792816cb4e25f0a4faea6ecb42ffd360bde293bfd8a4b6d2c255aa379f9',
          ],
          utxo: [
            {
              block_id: -1,
              transaction_hash: '4bf4a792816cb4e25f0a4faea6ecb42ffd360bde293bfd8a4b6d2c255aa379f9',
              index: 0,
              value: 100000,
            },
          ],
        },
      },
    })
    .get('/dashboards/address/2MtHCVNaDed65jnq6YUN7qiHoef6xGDH4PR')
    .reply(200, {
      data: {
        '2MtHCVNaDed65jnq6YUN7qiHoef6xGDH4PR': {
          address: {
            type: 'scripthash',
            script_hex: 'a9140b57b4f407249256f7b3fdf9450a94537664910687',
            balance: 0,
            balance_usd: 0,
            received: 200000,
            received_usd: 0,
            spent: 200000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-24 21:32:01',
            last_seen_receiving: '2019-01-24 21:32:01',
            first_seen_spending: '2019-01-24 22:59:05',
            last_seen_spending: '2019-01-24 22:59:05',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            'c4b15cf8d09a37d2361184cfa10678ea79a83f5455c78d69267238c8b351959e',
            'ec4d4ea133a5c741fadc229a9df3734a2026ca40760e3d0af686ffdc647487e5',
          ],
          utxo: [
            // fake value, this utxo doesn't reflect onchain state
            {
              block_id: -1,
              transaction_hash: '4bf4a792816cb4e25f0a4faea6ecb42ffd360bde293bfd8a4b6d2c255aa379f9',
              index: 0,
              value: 100000,
            },
          ],
        },
      },
      blockchairContext,
    })
    .get('/dashboards/address/2N6swovegiiYQZpDHR7yYxvoNj8WUBmau3z')
    .times(2)
    .reply(200, {
      data: {
        '2N6swovegiiYQZpDHR7yYxvoNj8WUBmau3z': {
          address: {
            type: 'scripthash',
            script_hex: 'a914958b85440d676edba2e3262da080ad61252d1a0a87',
            balance: 120000,
            balance_usd: 0,
            received: 120000,
            received_usd: 0,
            spent: 120000,
            spent_usd: 0,
            output_count: 1,
            unspent_output_count: 0,
            first_seen_receiving: '2019-01-24 22:59:05',
            last_seen_receiving: '2019-01-24 22:59:05',
            first_seen_spending: '2019-01-24 23:46:50',
            last_seen_spending: '2019-01-24 23:46:50',
            scripthash_type: 'multisig_2_of_3',
            transaction_count: 2,
          },
          transactions: [
            'aec04f5ebdde076ea87d2ab320d95526ecc63590488f456b29c208001bc262f8',
            'a9192dea1de9c79f4b6d4a4eeaf70542bd4eaec37206aab799b893d61c76552e',
          ],
          utxo: [
            {
              block_id: -1,
              transaction_hash: 'a9192dea1de9c79f4b6d4a4eeaf70542bd4eaec37206aab799b893d61c76552e',
              index: 1,
              value: 120000,
            },
          ],
        },
        blockchairContext,
      },
    });
  nock('https://mempool.space')
    .get('/api/v1/fees/recommended')
    .reply(200, { fastestFee: 20, halfHourFee: 20, hourFee: 6 });
};
