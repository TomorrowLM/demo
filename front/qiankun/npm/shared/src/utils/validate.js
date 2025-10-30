/* 密码验证
 * 长度不低于8位，不能包含空格和中文
 * */
export function validatePassword(str) {
  const reg = /^[^\s\u4E00-\uFA29\uE7C7-\uE7F3]{8,}$/;
  return reg.test(str);
}
/* 新密码验证
 * 密码至少8位有效字符，不能包含空白字符
 * 数字、小写字母、大写字母、符号四选三为强密码
 * 数字、小写字母、大写字母、符号都含为超强密码
 * 或者部分或者全部是中文字符则为超强密码
 * 密码任意连续三位字符不能出现等差规律
 * 密码任意连续三位字符不能出现键盘顺序
 * 密码任意字符占比例所有字符不超过四成
 * 密码去重字符占比例所有字符不少于四成
 * 密码和用户名所有字符重合率不超过四成
 * 密码不能包含用户名中连续三位或以上字符
 * */
export function validatePasswordNew(str) {
  const reg = /^[^\s\u4E00-\uFA29\uE7C7-\uE7F3]{8,}$/;
  return reg.test(str);
}
/* 用户名
 * 长度不超过14个字符或7个汉字，不允许包含空格，首位不允许为特殊符
 * */
export function validateUserName(str) {
  const reg = /^\w[^ ]*$/g;
  return reg.test(str) && str.indexOf("_") != 0;
}

/* 手机号码验证
 * 注意：为内蒙古新增以16、19开头的手机号
 * */
export function validatePhoneNumber(str) {
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
  return reg.test(str);
}

/* 人员名称
 * 长度限制为1~64个字符。仅允许中文、英文、空格与“·”
 * */
export function validateName(str) {
  const reg = /^[\u4e00-\u9fa5a-zA-Z]+[\u4e00-\u9fa5a-zA-Z\s\·]*$/;
  return reg.test(str);
}

/* 部门名称
 * 长度限制为1~64个字符。仅允许中文、英文与数字字符
 * */
export function validateDeptName(str) {
  const reg = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
  return reg.test(str);
}

/* 数字校验
 * 纯数字
 * */
export function validateNumber(str) {
  const reg = /^[0-9]+$/;
  return reg.test(str);
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

// 姓名校验
export function validateXm(str) {
  if (str == "") {
    return "不能为空";
  }
  if (/会计|出纳|财务|法人|先生|小姐|女士/.test(str)) {
    return "不能含有会计、出纳、财务、法人、先生、小姐、女士等特殊字符";
  }
  if (str.length > 20) {
    return "姓名长度超过限制";
  }
  if (str.length < 2) {
    return "姓名长度为2-20个字";
  }
}
// 组织管理正则

export function validatezzglXm(str) {
  // 姓名验证  最大长度：20
  const reg = /^[a-zA-Z\-.()（）\u4e00-\u9fa5]+$/;
  return reg.test(str);
}
export function validatezzglPhone(str) {
  // 手机号验证
  const reg = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
  return reg.test(str);
}
export function validatezzglShxy(str) {
  // 社会信用代码验证  长度：15-20
  let reg = /^[A-Za-z0-9]+$/;
  return reg.test(str);
}
export function validatezzglBmmc(str) {
  // 部门名称验证  最大长度：64
  let reg = /^[\-,，]/;
  return reg.test(str);
}
