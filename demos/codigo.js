
t = [10,20,30];
t = { x: 10, y: 20 }
t.x = t['x']
for(let i in t)
    alert(t[i]);

function kk() {
    var a = 1;
    if (true) { 
        let b = 2;
        //...
    }
    c = a + b;
    return c;
}

if (kk() === c) { alert('Iguales') }