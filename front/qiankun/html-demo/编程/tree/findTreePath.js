let path = { a: ['b', 'c', 'e'], b: ['d', 'f'], c: ['d'], e: ['f'], f: ['d'], d: [] }

function findPath(path, param1, param2) {
  let stack = [];
  for (let key in path[param1]) {
    console.log(path[param1][key])
    stack[key] = []
    fn(path, path[param1][key], param2, stack[key])
    stack[key].push(path[param1][key])
    console.log(stack[key])
  }
  function fn(path, param1, param2, stack) {
    if (path[param1]) {
      for (let key in path[param1]) {
        console.log(path[param1][key])
        if (path[param1][key] === param2) {
          stack.push(path[param1][key])
          return true
        }
        else {
          console.log(path[param1][key])
          const status = fn(path, path[param1][key], param2, stack);
          console.log(status)
          if (status) {
            stack.push(path[param1][key])
            return true
          }
        }
      }
    }
  }

  return stack
}

console.log(findPath(path, 'a', 'd'))