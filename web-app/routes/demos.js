var express = require('express');
var router = express.Router();

router.all('/', (req, res) => {
  res.status(200).type('text/xml').end('<html><body><h1>Educado</h1></body></html>');
})
router.get('/saluda/:nombre/*', (req, res) => {
  res.status(200).type('text/plain').end(`Hola ${req.params.nombre}` );
})
router.get('/despide', (req, res) => {
  res.status(200).type('text/plain').end('Adios mundo');
})
router.get('/json', (req, res) => {
  const rslt =  {id: 1, nombre:"Pepito", apellidos:"Grillo"};

  res.status(200).json(rslt);
})

module.exports = router;
