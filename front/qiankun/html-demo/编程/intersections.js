/**
 *  找到两个数组内相同的元素（交集），已知数组内无重复元素, 数组内元素为乱序，数组长度100万+，例如：
 *  输入:
 *   arr1 = [1,2,3,4,5,6,7,8,9]
 *   arr2 = [2,4,5,3,8,7]
 *  输出:
 *   [2,3,4,5,7,8]
 */

export function intersections(arr1: number[], arr2: number[]): number[] {

  const intersection: number[] = [];
  if (arr1.length >= arr2.length) {
    const setData = new Set(arr1);
    for (const item of arr2) {
      console.log(item);
      if (setData.has(item)) {
        intersection.push(item);
      }
    }
  }else {
    const setData = new Set(arr2);
    for (const item of arr2) {
      console.log(item);
      if (setData.has(item)) {
        intersection.push(item);
      }
    }
  }
  return intersection.sort();
}
