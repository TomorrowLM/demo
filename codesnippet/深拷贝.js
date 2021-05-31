function deepClone(source) {
    let target;
    if (typeof source === 'object') {
      target = Array.isArray(source) ? [] : {}
      for (let key in source) {
        if (source.hasOwnProperty(key)) {
          if (typeof source[key] !== 'object') {
            target[key] = source[key]
          } else {
            target[key] = deepClone(source[key])
          }
        }
      }
    } else {
      target = source
    }
    return target
  }
  let a ={name:['a','b'],age:[10,15],book:{1:[2,3,k]}}
  let b = deepClone(a)
  console.log(a)
  console.log(a == b)
  let c = a
  console.log(c)
  console.log(c == a)
