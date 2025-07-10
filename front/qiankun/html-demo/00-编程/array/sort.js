const data = [{ num: 5 }, { num: 3 }, { num: 1 }]

const data1 = Array.from({ length: data.length }).fill({})

data.forEach((item1, index1) => {
  let index = 1
  data.forEach((item2, index2) => {
    if (item1.num > item2.num) {
      index += 1
    } else if (item1.num === item2.num) {
      index += 0
    }
  })
  data1[index - 1] = item1
})

console.log(data1) // [{ num: 2 }, { num: 3 }, { num: 4 }]

console.log(data.sort((a, b) => a.num - b.num))

var arr = [3, 1, 4, 6, 5, 7, 2];

function quickSort(arr) {
    if(arr.length == 0) {
        return [];    // 返回空数组
    }

    var cIndex = Math.floor(arr.length / 2);
    var c = arr.splice(cIndex, 1);
    var l = [];
    var r = [];

    for (var i = 0; i < arr.length; i++) {
        if(arr[i] < c) {
            l.push(arr[i]);
        } else {
            r.push(arr[i]);
        }
    }

    return quickSort(l).concat(c, quickSort(r));
}

console.log(quickSort(arr));