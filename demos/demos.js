const circle = require('./circulo')
const cuadrado = require('./cuadrado')
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

let ev = (area) => console.log('an event occurred1!', area);

//myEmitter.on('event', ev);
myEmitter.once('event', ev);
//myEmitter.emit('event');

console.log(circle.area(100), circle.circumference(100))

let c = new cuadrado(10);

const interval = setInterval(
  () => {
    console.log(c.area())
    setImmediate(() => myEmitter.emit('event', c.area()));
    console.log('c.area()')
    c.width++;
  }, 100
);
setTimeout(() => console.log('Holaaa'), 500);
setTimeout(() => clearInterval(interval), 1);
setImmediate(() => console.log('setImmediate1'))
setImmediate(() => console.log('setImmediate2'))
// myEmitter.on('event', () => console.log('an event occurred2!'));
// myEmitter.off('event', ev);
// myEmitter.off('event', ev);
//myEmitter.emit('event');
console.log('Fin')

var buf = Buffer.alloc(256, '');

var len = buf.write('Hola mundo');
buf.writeInt8(77, 5);
buf[5]=109;
console.log(buf.length, len);
console.log(buf.toString('utf8'));
console.log(buf.toJSON());
console.log(buf.readInt8(5), buf[5]);
