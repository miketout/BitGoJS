import should from 'should';
import { AvaxC, getBuilder } from '../../../../../src';
import { TransactionType } from '../../../../../src/coin/baseCoin';
import * as testData from '../../../../resources/avaxc/avaxc';
import { TxData } from '../../../../../src/coin/eth/iface';

describe('AvaxC Wallet Initialization Builder', function () {
  let txBuilder: AvaxC.TransactionBuilder;

  const initTxBuilder = (): void => {
    txBuilder = getBuilder('tavaxc') as AvaxC.TransactionBuilder;
    txBuilder.fee({
      fee: '280000000000',
      gasLimit: '7000000',
    });
    txBuilder.counter(1);
    txBuilder.type(TransactionType.WalletInitialization);
  };

  describe('Avax C-Chain Wallet Initialization Transaction', () => {
    it('Should build walletInitialization', async () => {
      initTxBuilder();
      txBuilder.owner(testData.OWNER_1.ethAddress);
      txBuilder.owner(testData.OWNER_2.ethAddress);
      txBuilder.owner(testData.OWNER_3.ethAddress);
      txBuilder.sign({ key: testData.OWNER_1.ethKey });

      const tx = await txBuilder.build();
      const txJson: TxData = tx.toJson();

      tx.type.should.equal(TransactionType.WalletInitialization);
      txJson.gasLimit.should.equal('7000000');
      txJson.gasPrice.should.equal('280000000000');
      should.equal(txJson.nonce, 1);
      should.equal(txJson.chainId!, '0xa869');
      should.equal(tx.toBroadcastFormat(), testData.TX_BROADCAST);
    });

    it('Should build with counter 0 if not manually defined', async () => {
      txBuilder = getBuilder('tavaxc') as AvaxC.TransactionBuilder;
      txBuilder.fee({
        fee: '280000000000',
        gasLimit: '7000000',
      });
      txBuilder.type(TransactionType.WalletInitialization);

      txBuilder.owner(testData.OWNER_1.ethAddress);
      txBuilder.owner(testData.OWNER_2.ethAddress);
      txBuilder.owner(testData.OWNER_3.ethAddress);
      txBuilder.sign({ key: testData.OWNER_1.ethKey });

      const tx = await txBuilder.build();
      const txJson: TxData = tx.toJson();

      tx.type.should.equal(TransactionType.WalletInitialization);
      txJson.gasLimit.should.equal('7000000');
      txJson.gasPrice.should.equal('280000000000');
      should.equal(txJson.chainId!, '0xa869');
      should.equal(tx.toBroadcastFormat(), testData.TX_BROADCAST_ZERO_NONCE);
    });

    it('Should throw if building walletInitialization without fee', async function () {
      txBuilder = getBuilder('tavaxc') as AvaxC.TransactionBuilder;
      txBuilder.counter(1);
      txBuilder.type(TransactionType.WalletInitialization);
      txBuilder.counter(1);
      txBuilder.type(TransactionType.WalletInitialization);
      txBuilder.owner(testData.OWNER_1.ethAddress);
      txBuilder.owner(testData.OWNER_2.ethAddress);
      txBuilder.owner(testData.OWNER_3.ethAddress);
      txBuilder.sign({ key: testData.OWNER_1.ethKey });

      txBuilder.build().should.be.rejectedWith('Invalid transaction: missing fee');
    });

    it('Should throw if building walletInitialization without type', async function () {
      txBuilder = getBuilder('tavaxc') as AvaxC.TransactionBuilder;
      txBuilder.fee({
        fee: '280000000000',
        gasLimit: '7000000',
      });
      txBuilder.counter(1);
      should.throws(
        () => txBuilder.owner(testData.OWNER_1.ethAddress),
        (e) => e.message === 'Multisig wallet owner can only be set for initialization transactions',
      );
    });

    it('Should throw if building walletInitialization without owners', async function () {
      initTxBuilder();
      txBuilder.fee({
        fee: '280000000000',
        gasLimit: '7000000',
      });
      txBuilder.counter(1);
      txBuilder.type(TransactionType.WalletInitialization);
      should.throws(
        () => txBuilder.sign({ key: testData.OWNER_1.ethKey }),
        (e) => e.message === 'Cannot sign an wallet initialization transaction without owners',
      );
    });

    it('Should throw if building walletInitialization with only one owner', async function () {
      initTxBuilder();
      txBuilder.fee({
        fee: '280000000000',
        gasLimit: '7000000',
      });
      txBuilder.counter(1);
      txBuilder.type(TransactionType.WalletInitialization);
      txBuilder.owner(testData.OWNER_1.ethAddress);
      txBuilder.sign({ key: testData.OWNER_1.ethKey });

      txBuilder.build().should.be.rejectedWith('Invalid transaction: wrong number of owners -- required: 3, found: 1');
    });

    it('Should throw if building walletInitialization with only two owners', async function () {
      initTxBuilder();
      txBuilder.fee({
        fee: '280000000000',
        gasLimit: '7000000',
      });
      txBuilder.counter(1);
      txBuilder.type(TransactionType.WalletInitialization);
      txBuilder.owner(testData.OWNER_1.ethAddress);
      txBuilder.owner(testData.OWNER_2.ethAddress);
      txBuilder.sign({ key: testData.OWNER_1.ethKey });

      txBuilder.build().should.be.rejectedWith('Invalid transaction: wrong number of owners -- required: 3, found: 2');
    });
  });
});
