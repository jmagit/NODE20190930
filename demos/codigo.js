
t = [10,20,30];
t = { x: 10, y: 20 }
t.x = t['x']
for(let i in t)
    console.log(t[i]);

function kk() {
    var a = 1;
    if (true) {
        var b = 2;
        //...
    }
    c = a + b;
    return c;
}
t = [10,20,30];

t.filter(function(item) { return item > 0; });
t.filter(item => item > 0);

if (kk() === c) { console.log('Iguales') }

function Persona(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.cumple = () => ++this.edad;
}
let o = new Object();
o.nombre = 'Pepito';

let p = new Persona('Pepito', 22);
p = Persona('Pepito', 10);
console.log(p.cumple())
