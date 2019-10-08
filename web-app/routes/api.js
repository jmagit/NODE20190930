var fs = require('fs');
var express = require('express');
var router = express.Router();

let fich = 'data/personas.json';

router.get('/personas', (req, res) => {
  fs.readFile(fich, 'utf8', (err, data) => {
    if (err) throw err;
    const listado = JSON.parse(data);
    res.json(listado);
  });
})
router.get('/personas/:id', (req, res) => {
  fs.readFile(fich, 'utf8', (err, data) => {
    if (err) throw err;
    let listado = JSON.parse(data);
    let elemento = listado.find(item => item.id == req.params.id);

    if (elemento) {
      res.json(elemento);
    } else {
      res.status(404).end();
    }
  });
})
router.post('/personas', (req, res) => {
  const model = {
    id: null,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    edad: req.body.edad,
  };
  let  errors = []
  if (!model.nombre)
    errors.push('El nombre es obligatorio');
  if (errors.length === 0) {
    fs.readFile(fich, 'utf8', (err, data) => {
      if (err) throw err;
      let listado = JSON.parse(data);
      let id = listado.length === 0 ? 1 : (listado[listado.length - 1].id + 1);
      listado.push({
        id, nombre: model.nombre, apellidos: model.apellidos,
        edad: model.edad
      });
      fs.writeFile(fich, JSON.stringify(listado), 'utf8', (err) => {
        if (err) throw err;
        res.header('location', req.baseUrl + '/' + id);
        res.status(201).end();
      });
    });
  } else {
    res.status(400).json(errors);
  }
})
router.put('/personas/:id', async (req, res) => {
  let  errors = []
  const model = {
    id: req.params.id,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    edad: req.body.edad,
  };
  if (!model.nombre)
    errors.push('El nombre es obligatorio');
  if (errors.length === 0) {
    let data = await fs.promises.readFile(fich, 'utf8');
    let listado = JSON.parse(data);
    let index = listado.findIndex(item => item.id == req.params.id);
    if (index === -1) {
      res.status(404).end();
    } else {
      listado[index] = {
        id: req.params.id, nombre: model.nombre, apellidos: model.apellidos,
        edad: model.edad
      };
      await fs.promises.writeFile(fich, JSON.stringify(listado), 'utf8');
      res.status(200).json(model);
    }
  } else {
    res.status(400).json(errors);
  }
})
router.patch('/personas/:id', async (req, res) => {
  let  errors = []
  if (errors.length === 0) {
    let data = await fs.promises.readFile(fich, 'utf8');
    let listado = JSON.parse(data);
    let index = listado.findIndex(item => item.id == req.params.id);
    if (index === -1) {
      res.status(404).end();
    } else {
      listado[index] = Object.assign(listado[index], req.body);
      await fs.promises.writeFile(fich, JSON.stringify(listado), 'utf8');
      res.status(200).json(listado[index]);
    }
  } else {
    res.status(400).json(errors);
  }
})
router.delete('/personas/:id', async (req, res) => {
    let data = await fs.promises.readFile(fich, 'utf8');
    let listado = JSON.parse(data);
    let index = listado.findIndex(item => item.id == req.params.id);
    if (index === -1) {
      res.status(404).end();
    } else {
      listado.splice(index, 1);
      await fs.promises.writeFile(fich, JSON.stringify(listado), 'utf8');
      res.status(204).end();
    }
})

module.exports = router;
