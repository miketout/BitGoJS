import should from 'should';

import { Eth } from '../../../../src';

describe('Eth KeyPair', function () {
  // these are all encodings of the same key so the test suite will show that they we can interchange between them
  const xprv =
    'xprv9s21ZrQH143K3D8TXfvAJgHVfTEeQNW5Ys9wZtnUZkqPzFzSjbEJrWC1vZ4GnXCvR7rQL2UFX3RSuYeU9MrERm1XBvACow7c36vnz5iYyj2';
  const xpub =
    'xpub661MyMwAqRbcFhCvdhTAfpEEDV58oqDvv65YNHC686NNs4KbH8YZQJWVmrfbve7aAVHzxw8bKFxA7MLeDK6BbLfkE3bqkvHLPgaGHHtYGeY';
  const prv = '82A34E3867EA7EA4E67E27865D500AE84E98D07AB1BAB06526F0A5A5FDCC3EBA';
  const pub = '03D63D9FD9FD772A989C5B90EDB37716406356E98273E5F98FE07652247A3A8275';
  const uncompressedPub =
    '04D63D9FD9FD772A989C5B90EDB37716406356E98273E5F98FE07652247A3A827503E948A2FDBF74A981D4E0054F10EDA7042C2D469F44473D3C7791E0E326E355';
  const address = '0xeb317b9f2e0891d66c061ddc3f5ee7ed42d70a44';

  describe('should create a KeyPair', function () {
    it('from an xpub', () => {
      const keyPair = new Eth.KeyPair({ pub: xpub });
      const defaultKeys = keyPair.getKeys();
      should.not.exist(defaultKeys.prv);
      defaultKeys.pub.should.equal('03D63D9FD9FD772A989C5B90EDB37716406356E98273E5F98FE07652247A3A8275');

      const extendedKeys = keyPair.getExtendedKeys();
      should.not.exist(extendedKeys.xprv);
      extendedKeys.xpub.should.equal(xpub);
    });

    it('from an xprv', () => {
      const keyPair = new Eth.KeyPair({ prv: xprv });
      const defaultKeys = keyPair.getKeys();
      defaultKeys.prv!.should.equal(prv);
      defaultKeys.pub.should.equal(pub);

      const extendedKeys = keyPair.getExtendedKeys();
      extendedKeys.xprv!.should.equal(xprv);
      extendedKeys.xpub.should.equal(xpub);
    });

    it('from an uncompressed public key', () => {
      const keyPair = new Eth.KeyPair({ pub: uncompressedPub });
      const defaultKeys = keyPair.getKeys();
      should.not.exist(defaultKeys.prv);
      defaultKeys.pub.should.equal(uncompressedPub);

      should.throws(() => keyPair.getExtendedKeys());
    });

    it('from a compressed public key', () => {
      const keyPair = new Eth.KeyPair({ pub });
      const defaultKeys = keyPair.getKeys();
      should.not.exist(defaultKeys.prv);
      defaultKeys.pub.should.equal(uncompressedPub);
      should.throws(() => keyPair.getExtendedKeys());
    });

    it('from a raw private key', () => {
      const keyPair = new Eth.KeyPair({ prv });
      const defaultKeys = keyPair.getKeys();
      defaultKeys.prv!.should.equal(prv);
      defaultKeys.pub.should.equal(uncompressedPub);

      should.throws(() => keyPair.getExtendedKeys());
    });
  });

  describe('should fail to create a KeyPair', function () {
    it('from an invalid public key', () => {
      const source = {
        pub: '01D63D',
      };
      should.throws(() => new Eth.KeyPair(source));
    });

    it('from an invalid private key', () => {
      const source = {
        prv: '82A34E',
      };
      should.throws(() => new Eth.KeyPair(source));
    });
  });

  describe('getAddress', function () {
    it('should get an address from xprv', () => {
      const keyPair = new Eth.KeyPair({ prv: xprv });
      const calculatedAddress = keyPair.getAddress();
      calculatedAddress.should.equal(address);
    });

    it('should get an address from xpub', () => {
      const keyPair = new Eth.KeyPair({ pub: xpub });
      const calculatedAddress = keyPair.getAddress();
      calculatedAddress.should.equal(address);
    });

    it('should get an address from prv', () => {
      const keyPair = new Eth.KeyPair({ prv });
      const calculatedAddress = keyPair.getAddress();
      calculatedAddress.should.equal(address);
    });

    it('should get an address from pub', () => {
      const keyPair = new Eth.KeyPair({ pub });
      const calculatedAddress = keyPair.getAddress();
      calculatedAddress.should.equal(address);
    });

    it('should get an address from uncompressed pub', () => {
      const keyPair = new Eth.KeyPair({ pub: uncompressedPub });
      const calculatedAddress = keyPair.getAddress();
      calculatedAddress.should.equal(address);
    });
  });

  describe('getExtendedKeys', function () {
    it('should get the keys in extended format from xprv', () => {
      const keyPair = new Eth.KeyPair({ prv: xprv });
      const { xprv: calculatedXprv, xpub: calculatedXpub } = keyPair.getExtendedKeys();
      calculatedXprv!.should.equal(xprv);
      calculatedXpub.should.equal(xpub);
    });

    it('should get the keys in extended format from xpub', () => {
      const keyPair = new Eth.KeyPair({ pub: xpub });
      const { xprv: calculatedXprv, xpub: calculatedXpub } = keyPair.getExtendedKeys();
      should.not.exist(calculatedXprv);
      calculatedXpub.should.equal(xpub);
    });

    it('should not be able to get keys from prv', () => {
      const keyPair = new Eth.KeyPair({ prv });

      should.throws(() => keyPair.getExtendedKeys());
    });

    it('should get the keys in extended format from pub', () => {
      const keyPair = new Eth.KeyPair({ pub });

      should.throws(() => keyPair.getExtendedKeys());
    });

    it('should get the keys in extended format from uncompressed pub', () => {
      const keyPair = new Eth.KeyPair({ pub: uncompressedPub });

      should.throws(() => keyPair.getExtendedKeys());
    });
  });
});
