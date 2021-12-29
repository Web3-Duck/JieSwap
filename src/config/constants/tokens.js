const ChainId = {
  MAINNET: 56,
  TESTNET: 3,
};
const { MAINNET, TESTNET } = ChainId;
const web3 = require('web3');

export class Token {
  constructor(chainId, address, decimals, symbol, name, projectLink) {
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
    this.chainId = chainId;
    this.address = web3.utils.toChecksumAddress(address);
    this.projectLink = projectLink;
  }

  equals(other) {
    // short circuit on reference equality
    if (this === other) {
      return true;
    }
    return this.chainId === other.chainId && this.address === other.address;
  }
}
export const mainnetTokens = {
  wbnb: new Token(MAINNET, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.com/'),
  bnb: new Token(MAINNET, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'BNB', 'BNB', 'https://www.binance.com/'),
};

export const testnetTokens = {
  bnb: new Token(TESTNET, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.com/'),
  wbnb: new Token(TESTNET, '0xc778417e063141139fce010982780140aa0cd5ab', 18, 'WBNB', 'Wrapped BNB', 'https://www.binance.com/'),
  usdt: new Token(TESTNET, '0x110a13FC3efE6A245B50102D2d79B3E76125Ae83', 18, 'USDT', 'USDT', 'https://www.paxos.com/busd/'),
};

const tokens = () => {
  const chainId = 3;

  if (parseInt(chainId, 10) === ChainId.TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] };
    }, {});
  }

  return mainnetTokens;
};

export function serializeToken(token) {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
  };
}

export const serializeTokens = () => {
  const unserializedTokens = tokens();
  const serializedTokens = Object.keys(unserializedTokens).reduce((accum, key) => {
    return { ...accum, [key]: serializeToken(unserializedTokens[key]) };
  }, {});

  return serializedTokens;
};

export default tokens();
