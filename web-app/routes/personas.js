var fs = require('fs');
var express = require('express');
var router = express.Router();

let fich = 'data/personas.json';

router.get('/', (req, res) => {
  fs.readFile(fich, 'utf8', (err, data) => {
    if (err) throw err;
    const rslt = {
      title: "Mantenimiento de personas",
      listado: JSON.parse(data)
    };
    res.render('persona-list', rslt);
  });
})
router.get('/add', (req, res) => {
  const model = {
    title: "Añadir persona",
    url: '/personas/add',
    id: null,
    nombre: '',
    apellidos: '',
    edad: ''

  };
  res.render('persona-form', model);
})
router.post('/add', (req, res) => {
  const model = {
    title: "Añadir persona",
    url: '/personas/add',
    id: null,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    edad: req.body.edad,
    error: []
  };
  if (!model.nombre)
    model.error.push('El nombre es obligatorio');
  if (model.error.length === 0) {
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
        res.redirect('/personas');
      });
    });
  } else {
    res.render('persona-form', model);
  }
})
router.get('/:id/edit', (req, res) => {
  fs.readFile(fich, 'utf8', (err, data) => {
    if (err) throw err;
    let listado = JSON.parse(data);
    let rslt = listado.find(item => item.id == req.params.id);

    if (rslt) {
      const model = {
        title: "Editar persona",
        url: `/personas/${req.params.id}/edit`,
        id: rslt.id,
        nombre: rslt.nombre,
        apellidos: rslt.apellidos,
        edad: rslt.edad
      };
      res.render('persona-form', rslt);
    } else {
      res.status(404).end();
    }
  });
})
router.post('/:id/edit', async (req, res) => {
  const model = {
    title: "Editar persona",
    url: `/personas/${req.params.id}/edit`,
    id: null,
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    edad: req.body.edad,
    error: []
  };
  if (!model.nombre)
    model.error.push('El nombre es obligatorio');
  if (model.error.length === 0) {
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
      res.redirect('/personas');
    }
  } else {
    res.render('persona-form', model);
  }
})
router.get('/:id', (req, res) => {
  fs.readFile(fich, 'utf8', (err, data) => {
    if (err) throw err;
    let listado = JSON.parse(data);
    let rslt = listado.find(item => item.id == req.params.id);

    if (rslt) {
      const model = {
        title: "Ver persona",
        id: rslt.id,
        nombre: rslt.nombre,
        apellidos: rslt.apellidos,
        edad: rslt.edad
      };
      res.render('persona-view', rslt);
    } else {
      res.status(404).end();
    }
  });
})

module.exports = router;
