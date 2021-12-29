const base = [
  {
    "name": "WBNB Token",
    "symbol": "WBNB",
    "address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    "chainId": 56,
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/bnb.png"
  },
  {
    "name": "BUSD Token",
    "symbol": "BUSD",
    "address": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    "chainId": 56,
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/busd.png"
  },
  {
    "name": "Tether USD",
    "symbol": "USDT",
    "address": "0x55d398326f99059fF775485246999027B3197955",
    "chainId": 56,
    "decimals": 18,
    "logoURI": "https://raw.githubusercontent.com/Sexy-J/JieSwap/main/src/assets/img/usdt.png"
  }
];

export function getAllPair(curA, curB) {
  let lpPair = [];
  for (let i = 0; i < base.length; i++) {
    if (base[i].address != curA.address) {
      lpPair.push({ toCur: base[i], fromCur: curA });
    }

    if (base[i].address != curB.address) {
      lpPair.push({ toCur: curB, fromCur: base[i] });
    }
  }
  return lpPair;
}
