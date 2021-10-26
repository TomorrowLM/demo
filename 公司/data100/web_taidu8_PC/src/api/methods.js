import md5 from 'js-md5'
const methods = {
    /**
 * 生成MD5
 */
    exchangeMD5(obj) {
        var newkey = Object.keys(obj).sort();
        var newObj = {};
        for (var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = obj[newkey[i]];
        }
        // console.log(newObj,"新的")
        var str = '';
        for (var key in newObj) {
            str = str + key + '=' + newObj[key] + "&"
        }
        str = str.substr(0, str.length - 1)
        // console.log(str,"xinchuan")
        var stringSignTemp = str + "&key=951d4c42326611e8a17f6c92bf3bb67f"
        var sign = md5(stringSignTemp).toUpperCase()
        return sign;
    },
    nonce_str(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    cityArr() {
        var timeArrs = [];
        for (var j = 1; j < 13; j++) {
            if (j == 2) {
                var numArr1 = []
                for (var i = 1; i < 29; i++) {
                    var obj = {};
                    obj.id = i + '';
                    obj.value = i + '日';
                    numArr1.push(obj)
                }
                var obj = {};
                obj.id = j + '';
                obj.value = j + '月';
                obj.childs = numArr1;
                timeArrs.push(obj);
            } else if (j + '' == '1' || j == 3 || j == 5 || j == 7 || j == 8 || j == 10 || j == 12) {
                var numArr2 = []
                for (var i = 1; i < 32; i++) {
                    var obj = {};
                    obj.id = i + '';
                    obj.value = i + '日';
                    numArr2.push(obj)
                }
                var obj = {};
                obj.id = j + '';
                obj.value = j + '月';
                obj.childs = numArr2;
                timeArrs.push(obj);
            } else {
                var numArr3 = []
                for (var i = 1; i < 31; i++) {
                    var obj = {};
                    obj.id = i + '';
                    obj.value = i + '日';
                    numArr3.push(obj)
                }
                var obj = {};
                obj.id = j + '';
                obj.value = j + '月';
                obj.childs = numArr3;
                timeArrs.push(obj);
            }
        }
        // var t = 1940;
        var t = new Date().getFullYear() - 71
        var weekdayArr = [];
        for (var i = 10; i < 71; i++) {
            var obj = {};
            var str = t++;
            str = str + '年';
            obj.id = t + '';
            obj.value = str;
            obj.childs = timeArrs;
            weekdayArr.push(obj)
        }
        return weekdayArr
    }
}

export default methods