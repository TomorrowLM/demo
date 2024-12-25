"use strict";
/**              原生                      */
function formatDateToYmdHm(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
// 示例用法
const currentDate = new Date();
console.log(formatDateToYmdHm(currentDate)); // 输出类似 "2023-10-05 14:30"
