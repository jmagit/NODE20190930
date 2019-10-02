const express = require('express')
const app = express()
const port = 4000

app.all('/demos', (req, res) => {
  res.status(200).type('text/plain').end('Educado');
})
app.get('/demos/saluda', (req, res) => {
  res.status(200).type('text/plain').end('Hola mundo');
})
app.get('/demos/despide', (req, res) => {
  res.status(200).type('text/plain').end('Adios mundo');
})


app.listen(port, () => console.log(`App listening on port ${port}!`))
