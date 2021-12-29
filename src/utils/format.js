const BigNumber = require('bignumber.js');

export function parseAmount(amount = '1', decimal = 18) {
  if (!amount) return '0';

  amount = cleanupAmount(amount);

  const split = amount.split('.');
  const wholePart = split[0];
  const fracPart = split[1] || '';
  if (split.length > 2 || fracPart.length > decimal) {
    throw new Error(`Cannot parse '${amount}' as bignumber`);
  }
  return trimLeadingZeroes(wholePart + fracPart.padEnd(decimal, '0'));
}
export function formatAmount(balance, decimal = 18) {
  const balanceBN = new BigNumber(balance, 10);
  balance = balanceBN.toString(10);
  const wholeStr = balance.substring(0, balance.length - decimal) || '0';
  const fractionStr = balance
    .substring(balance.length - decimal)
    .padStart(decimal, '0')
    .substring(0, decimal);

  return trimTrailingZeroes(`${wholeStr}.${fractionStr}`);
}

export function cleanupAmount(amount) {
  return amount.replace(/,/g, '').trim();
}

export function trimTrailingZeroes(value) {
  return value.replace(/\.?0*$/, '');
}

export function trimLeadingZeroes(value) {
  value = value.replace(/^0+/, '');
  if (value === '') {
    return '0';
  }
  return value;
}

export function formatWithCommas(value) {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, '$1,$2');
  }
  return value;
}

export function toFixed(number, pp) {
  let num = isNaN(number) || !number ? 0 : number;
  let p = isNaN(pp) || !pp ? 0 : pp;
  num = getFullNum(num);
  var n = (num + '').split('.');
  var x = n.length > 1 ? n[1] : '';
  if (x.length > p) {
    x = x.substr(0, p);
  } else {
    x += Array(p - x.length + 1).join('0');
  }
  return n[0] + (x == '' ? '' : '.' + x);
}
export function accMul(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new BigNumber(arg1).times(new BigNumber(arg2));
  return num.toFixed();
}

export function getFullNum(num) {
  // 处理非数字
  if (isNaN(num)) {
    return num;
  }
  const str = String(num);
  if (!/e/i.test(str)) {
    return num;
  }
  return Number(num)
    .toFixed(18)
    .replace(/\.?0+$/, '');
}

export function accDiv(arg1, arg2) {
  if (!arg1 || !arg2) {
    return 0;
  }
  const num = new BigNumber(arg1).div(new BigNumber(arg2));
  return num.toFixed();
}

export function accAdd(arg1, arg2) {
  const num = new BigNumber(arg1).plus(new BigNumber(arg2));
  return num.toFixed();
}
export function accSub(arg1, arg2) {
  const num = new BigNumber(arg1).minus(new BigNumber(arg2));
  return num.toFixed();
}

// 大于等于
export function accGte(arg1, arg2) {
  return new BigNumber(arg1).gte(new BigNumber(arg2));
}

// 大于
export function accGt(arg1, arg2) {
  return new BigNumber(arg1).gt(new BigNumber(arg2));
}

export function gasProcessing(arg1) {
  return toFixed(accMul(new BigNumber(arg1), 1.1), 0);
}

// 显示固定位数
export function significantDigits(arg1) {
  if (!arg1) {
    return arg1;
  }
  const num = new BigNumber(arg1);
  if (num > 100000) {
    return num.toFixed(0);
  }
  if (num > 10000) {
    return num.toFixed(1);
  }
  if (num > 1000) {
    return num.toFixed(2);
  }
  if (num > 100) {
    return num.toFixed(3);
  }
  if (num > 10) {
    return num.toFixed(4);
  }
  if (num > 1) {
    return num.toFixed(5);
  }
  if (num > 0.1) {
    return num.toFixed(6);
  }
  if (num > 0.01) {
    return num.toFixed(7);
  }
  if (num > 0.001) {
    return num.toFixed(8);
  }
  if (num > 0.0001) {
    return num.toFixed(9);
  }
  if (num > 0.0001) {
    return num.toFixed(10);
  }
  if (num > 0.0001) {
    return num.toFixed(11);
  }

  if (num > 0.00001) {
    return num.toFixed(12);
  }
  if (num > 0.000001) {
    return num.toFixed(13);
  }
  if (num > 0.0000001) {
    return num.toFixed(14);
  }
  if (num > 0.00000001) {
    return num.toFixed(15);
  }
  if (num > 0.000000001) {
    return num.toFixed(16);
  }
  if (num > 0.0000000001) {
    return num.toFixed(17);
  }
  if (num > 0.00000000001) {
    return num.toFixed(18);
  }

  if (num > 0.000000000001) {
    return num.toFixed(19);
  }
  if (num > 0.0000000000001) {
    return num.toFixed(20);
  }
  if (num > 0.00000000000001) {
    return num.toFixed(21);
  }
  if (num > 0.000000000000001) {
    return num.toFixed(22);
  }
  if (num > 0.0000000000000001) {
    return num.toFixed(22);
  }
  return new BigNumber(arg1).toString();
}

export function toPrecision(arg1) {
  let num = new BigNumber(arg1);
  if (accGte(num, 1000)) {
    return toFixed(num, 0);
  }

  num = num.toPrecision(4);
  if (num.includes('e')) {
    const [num1, uint] = num.split('e');
    const newUint = Number(uint);
    num = accMul(new BigNumber(num1).toString(10), new BigNumber(10).pow(newUint).toString(10));
  }
  return num;
}
