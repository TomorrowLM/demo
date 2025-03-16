// main.js
var mod = require('./copy');

console.log(mod.counter);  // 3
mod.incCounter();
//内部变化影响不到输出的mod.counter
console.log(mod.counter); // 3