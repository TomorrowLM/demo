import CryptoJS from 'crypto-js';
import log from 'loglevel';

/**
 * 根据盐值md5加密密码
 *
 * @export
 * @param {string} password
 * @returns {string}
 */
export function encryptMD5Password(password: string): string {
  return CryptoJS.MD5(`${password}{7zs1JKiilF}`).toString();
}

export function encryptMD5(content: string): string {
  return CryptoJS.MD5(`${content}`).toString();
}

export function encBase64(str: string): string {
  try {
    if (str) {
      const wordArray = CryptoJS.enc.Utf8.parse(str);
      return CryptoJS.enc.Base64.stringify(wordArray);
    }
    return '';
  } catch (e) {
    log.warn('encBase64', str, e);
    return '';
  }
}

export function decBase64(encodedStr: string): string {
  try {
    if (encodedStr) {
      return CryptoJS.enc.Base64.parse(encodedStr).toString(CryptoJS.enc.Utf8);
    }
    return '';
  } catch (e) {
    log.warn('decBase64', encodedStr, e);
    return '';
  }
}

function randomPassword(size: number) {
  const seed = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'm',
    'n',
    'p',
    'Q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ]; //数组
  const seedlength = seed.length; //数组长度
  let createPassword = '';
  for (let i = 0; i < size; i++) {
    const j = Math.floor(Math.random() * seedlength);
    createPassword += seed[j];
  }
  return createPassword;
}

export function generateDefaultPwd() {
  return randomPassword(6);
}
