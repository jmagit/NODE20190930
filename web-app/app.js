var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(logger('dev'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.all('/demos', (req, res) => {
  res.status(200).type('text/xml').end('<html><body><h1>Educado</h1></body></html>');
})
app.get('/demos/saluda/:nombre/*', (req, res) => {
  res.status(200).type('text/plain').end(`Hola ${req.params.nombre}` );
})
app.get('/demos/despide', (req, res) => {
  res.status(200).type('text/plain').end('Adios mundo');
})
app.get('/google', (req, res) => {
  if(!res.headersSent)
    res.redirect(301, 'https://google.es')
  res.status(500).end();
})
app.get('/cotilla/:id/:cmd', (req, res) => {
  let rslt = `ID: ${req.params.id} `;
  if(req.query.page)
    rslt += `page: ${req.query.page} `;
  else {
    res.status(400).end('Falta el page');
    return;
  }
  if(req.query.size) rslt += `size: ${req.query.size} `;
  if(req.get('Accept-Language')) rslt += `idioma: ${req.get('Accept-Language')} `;
  if(req.body) {
    rslt += `nombre: ${req.body.nombre} `;
    rslt += `apellidos: ${req.body.apellidos} `;
  }
  res.status(200).type('text/plain').end(rslt);
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
