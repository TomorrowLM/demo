let t1 = moment().locale("zh-cn").format("YYYY-MM-DD HH:mm:ss");
let t2 = moment("2021-07-02 14:33:33");
let t3 = t2.diff(t1, "second"); //计算相差的秒
let d = Math.floor(Math.floor(Math.floor(t3 / 60) / 60) / 24); //相差的天
//时
let t = t3 - d * 24 * 60 * 60;
t = Math.floor(Math.floor(t / 60) / 60);
//分
let m = t3 - d * 24 * 60 * 60 - t * 60 * 60;
m = Math.floor(m / 60);
//秒
let s = t3 - d * 24 * 60 * 60 - t * 60 * 60 - m * 60;

