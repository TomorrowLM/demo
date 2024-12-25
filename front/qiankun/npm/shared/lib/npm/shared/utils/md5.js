"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeMD5 = exports.nonce_str = void 0;
/**
 * 随机生成字符串
 * @param  len 字符串长度
 * @create by zqm on 2018-11-1
 */
function nonce_str(len) {
    len = len || 32;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /*易混淆的字符oOLl,9gq,Vv,Uu,I1*/
    const maxPos = $chars.length;
    let pwd = '';
    for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
exports.nonce_str = nonce_str;
/**
 * md5加密
 * @param  obj 需要md5的内容
 * @return  sign 签名
 * @create by zqm on 2018-11-1
 */
const js_md5_1 = __importDefault(require("js-md5"));
function exchangeMD5(obj) {
    var newkey = Object.keys(obj).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    var str = '';
    for (var key in newObj) {
        str = str + key + '=' + newObj[key] + "&";
    }
    str = str.substr(0, str.length - 1);
    var stringSignTemp = str + "&key=951d4c42326611e8a17f6c92bf3bb67f";
    var sign = (0, js_md5_1.default)(stringSignTemp).toUpperCase();
    return sign;
}
exports.exchangeMD5 = exchangeMD5;
