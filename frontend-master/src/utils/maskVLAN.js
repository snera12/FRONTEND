const regExpDigits = /[0-9]+/;
const MAX_VLAN = +4095;

export const maskVLANUtil = (e, str) => {
  let result = str;
  const len = str.length;
  if (e.inputType === 'insertFromPaste' || e.inputType === 'insertFromDrop') {
    let numStr = '';
    str.split('').forEach(s => {
      if (regExpDigits.test(s)) {
        if (!numStr.length && s === '0') s = '';
        numStr += s;
      }
    });
    const num = +numStr;
    if (num && num > MAX_VLAN) numStr = str.slice(0, len - 1);
    result = numStr;
  }
  if (e.inputType === 'insertText') {
    const s = e.data;
    const lastS = str[len];
    if (!regExpDigits.test(s)) {
      if (lastS === s) {
        result = str.slice(0, len - 1);
      } else {
        const sPos = str.indexOf(s);
        result = str.slice(0, sPos) + str.slice(sPos + 1, len);
      }
    } else {
      if (str[0] === '0') return str.slice(1);

      const num = +str;
      if (num && num > MAX_VLAN) result = str.slice(0, len - 1);
    }
  }
  return result;
};