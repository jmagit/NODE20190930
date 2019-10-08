var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs');
var formidable = require("formidable");
var mysql = require('mysql')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var demosRouter = require('./routes/demos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/demos', demosRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/files', express.static('uploads'))
app.get('/fileupload', function (req, res) {
  res.status(200).end(`
    <html><body><form action="fileupload" method="post" enctype="multipart/form-data">
      <input type="file" name="filetoupload"><input type="submit">
    </form></body></html>
  `)
})
app.post('/fileupload', function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let newpath = __dirname + "/uploads/" + files.filetoupload.name;
    fs.copyFile(files.filetoupload.path, newpath, function (err) {
      if (err) throw err;
      newpath = "files/" + files.filetoupload.name;
      res.status(200).end(`<a href="${newpath}">${newpath}</a>`);
    });
  });
})

app.get('/db', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sakila'
  })

  connection.connect()

  connection.query('SELECT * FROM `sakila`.`category`', function (err, rows, fields) {
    if (err) throw err
    res.status(200).json(rows);
  })
})

app.get('/json', (req, res) => {
  const rslt = { id: 1, nombre: "Pepito", apellidos: "Grillo" };

  res.status(200).json(rslt);
})
app.get('/personas', (req, res) => {
  fs.readFile('data/personas.json', 'utf8', (err, data) => {
    if (err) throw err;
    const rslt = {
      title: "Mantenimiento de personas",
      listado: JSON.parse(data)
    };
    res.render('persona-list', rslt);
  });
})
app.get('/personas/add', (req, res) => {
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
app.post('/personas/add', (req, res) => {
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
    fs.readFile('data/personas.json', 'utf8', (err, data) => {
      if (err) throw err;
      let listado = JSON.parse(data);
      let id = listado.length === 0 ? 1 : (listado[listado.length - 1].id + 1);
      listado.push({
        id, nombre: model.nombre, apellidos: model.apellidos,
        edad: model.edad
      });
      fs.writeFile('data/personas.json', JSON.stringify(listado), 'utf8', (err) => {
        if (err) throw err;
        res.redirect('/personas');
      });
    });
  } else {
    res.render('persona-form', model);
  }
})
app.get('/personas/:id/edit', (req, res) => {
  fs.readFile('data/personas.json', 'utf8', (err, data) => {
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
app.post('/personas/:id/edit', async (req, res) => {
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
    let data = await fs.promises.readFile('data/personas.json', 'utf8');
    let listado = JSON.parse(data);
    let index = listado.findIndex(item => item.id == req.params.id);
    if (index === -1) {
      res.status(404).end();
    } else {
      listado[index] = {
        id: req.params.id, nombre: model.nombre, apellidos: model.apellidos,
        edad: model.edad
      };
      await fs.promises.writeFile('data/personas.json', JSON.stringify(listado), 'utf8');
      res.redirect('/personas');
    }
  } else {
    res.render('persona-form', model);
  }
})
app.get('/personas/:id', (req, res) => {
  fs.readFile('data/personas.json', 'utf8', (err, data) => {
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


app.get('/google', (req, res) => {
  if (!res.headersSent)
    res.redirect(301, 'https://google.es')
  res.status(500).end();
})
app.get('/cotilla/*', (req, res, next) => {
  res.locals.di = 'algo';
  res.type('text/plain')
  //res.end();
  next();
});
app.get('/cotilla/:id/:cmd', (req, res, next) => {
  let rslt = `ID: ${req.params.id} `;
  if (req.query.page)
    rslt += `page: ${req.query.page} `;
  else {
    res.status(400).end('Falta el page');
    //throw new Error('Falta el page')
    //next(new Error('Falta el page'));
    return;
  }
  if (req.query.size) rslt += `size: ${req.query.size} `;
  if (req.get('Accept-Language')) rslt += `idioma: ${req.get('Accept-Language')} `;
  if (req.body) {
    rslt += `nombre: ${req.body.nombre} `;
    rslt += `apellidos: ${req.body.apellidos} `;
  }
  rslt += `dice: ${res.locals.di} `;
  res.status(200).end(rslt);
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).end();
  //next(createError(404));
  next();
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
