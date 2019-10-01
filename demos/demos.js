const circle = require('./circulo')
const cuadrado = require('./cuadrado')

console.log(circle.area(100), circle.circumference(100))
console.log((new cuadrado(10)).area())
