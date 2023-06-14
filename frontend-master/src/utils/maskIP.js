const MAX_IP = 255;
const MAX_OCTETS = 4;
const maxOctetLengt = (MAX_IP + '').length;
const regExpDigits = /\d+/;
const regExpDigitsAndDot = /[\d.]+/;
const regExpAllAntiDigitsAndDot = /[^\d.]+/g;
const regExcpDotAnyKey = /[юЮ/]/;

const delEndSymbol = str => str.slice(0, str.length - 1);
const delLastInputSymbol = (str, s) => {
  const len = str.length;
  const endS = str[len];
  if (endS === s) return delEndSymbol(str);
  const sPos = str.indexOf(s);
  return str.slice(0, sPos) + str.slice(sPos + 1, len);
};
const reсurDelDoubleSymbol = (str, s) => {
  s += '';
  const newStr = str.replaceAll(s + s, s);
  return newStr === str ? str : reсurDelDoubleSymbol(newStr, s);
};
const recureSplitNumUnder255 = num => {
  // TEST: [2550, 9788, 25500, 99877]
  const maxL = +maxOctetLengt;
  if (num <= MAX_IP) return num;
  const str = num + '';
  const newStr3 = str.slice(0, maxL);
  return (+newStr3 <= MAX_IP) ?
    newStr3 + '.' + recureSplitNumUnder255(str.slice(maxL)) : 
    str.slice(0, maxL - 1) + '.' + recureSplitNumUnder255(str.slice(maxL - 1));
};

const testOctets = str => {
  const octets = str.split('.');
  let arr = [];
  octets.forEach((octet, i) => {
    let result = '';
    if (octet !== '') {
      const len = octet.length;
      const num = +octet;
      result = num;
      if (num > MAX_IP) {
        result = recureSplitNumUnder255(num);
      } else {
        const isOctetFull = len === maxOctetLengt;
        const isOctetNotLast = octets.length > i;
        if (isOctetFull && isOctetNotLast) result = octet + '.'; 
      }
      if (i === 0 & num === 0) result = '';
    }
    if (result[0] === '0' && result !== 0) result = result.slice(1);
    result += '';
    if (i === MAX_OCTETS - 1 && result.endsWith('.')) result = result.slice(0, -1);
    if (i<4) arr.push(result);
  });
  arr = arr.join('.').replaceAll('..', '.').split('.');
  arr = arr.length <= MAX_OCTETS ? arr : arr.slice(0, MAX_OCTETS);
  return arr.join('.');
};

export const maskIPUtil = (e, str) => {
  str = String(str);
  const len = str.length;
  
  if (e.inputType === 'insertText') {
    let s = e.data;
    const lenBefore = len - 1;
    if (regExcpDotAnyKey.test(s)) {
      s = '.';
      str = str.replace(regExcpDotAnyKey, s);
    }
    if (!regExpDigitsAndDot.test(s)) return delLastInputSymbol(str, s);
    if (s === '.' && lenBefore === 0) return '';
    if (s === '.' && str.endsWith('.') &&
      str.split('.').length > MAX_OCTETS) str = str.slice(0, -1);
    if (str.includes('..')) return reсurDelDoubleSymbol(str, '.');
    if (regExpDigits.test(s)) return testOctets(str);
  }
  if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
    // TODO: test '033.2.3er.9333..'
    let result = str.replace(regExpAllAntiDigitsAndDot, '');
    result = reсurDelDoubleSymbol(result, '.');
    return testOctets(result);
  }
  return str;
};