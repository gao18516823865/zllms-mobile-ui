/**
 * 保留小数
 * @param {*} value
 */
export const toFixedString = (value, fractionDigits = 2) => {
  if (value) {
    if (!isNaN(value)) {
      let stringValue = value.toString();
      const index = stringValue.indexOf('.');
      if (index !== -1) {
        stringValue = stringValue.substring(0, fractionDigits + index + 1);
      } else {
        stringValue = stringValue.substring(0);
      }
      return parseFloat(stringValue).toFixed(fractionDigits);
    }
  }
  return parseFloat('0.00').toFixed(fractionDigits);
};

export function isJSONString(valString) {
  if (typeof valString === 'string') {
    try {
      const jsonObecjt = JSON.parse(valString);
      if (typeof jsonObecjt === 'object' && jsonObecjt) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
/** 给一个字符串加*** */
export const intoStarString = (valString, start = 3, end = 2) => {
  if (typeof valString === 'string') {
    if (end === 0) {
      const startString = valString.slice(0, start);
      return `${startString}****`;
    }
    if (valString.length < start + end) {
      const helf = parseInt(valString.length / 2);
      const startString = valString.slice(0, helf);
      const endString = valString.slice(-helf);
      return `${startString}****${endString}`;
    }
    const startString = valString.slice(0, start);
    const endString = valString.slice(-end);
    return `${startString}****${endString}`;
  }
  return '****';
};
/**
 * 字符替换
 * @param {*} characterInfo // 要替换的字符集合[{'a':'b'}], a替换为b
 * @param {*} valString
 * @returns
 */
export const replaceChars = (valString = '', characterInfo = {}) => {
  if (valString) {
    const targetArray = [];
    const sourceArray = Array.from(valString);
    sourceArray.forEach(item => {
      if (characterInfo.hasOwnProperty(item)) {
        targetArray.push(characterInfo[item]);
      } else {
        targetArray.push(item);
      }
    });
    return targetArray.join('');
  }

  return '';
};

export const lastFourDigits = (value = '') => {
  if (value) {
    const fourDigits = value.substring(value.length - 4);
    if (fourDigits === '') {
      return '';
    }
    return fourDigits;
  }
};
/** 把对象转为get参数 */
export const objectToUrlParams = params => {
  return Object.entries(params)
    .reduce((pre, cur) => {
      pre.push(cur.join('='));
      return pre;
    }, [])
    .join('&');
};
