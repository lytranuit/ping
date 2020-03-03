var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var ajaxRouter = require('./routes/ajax');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use('/', indexRouter);
app.use('/ajax', ajaxRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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





var jsonfile = require('jsonfile');
var ping = require("ping");
var moment = require('moment')
var file = './data.json'
global.data_ping = jsonfile.readFileSync(file);
var is_done = true;
setInterval(() => {
  let promiseAll = [];
  if (!is_done)
    return;
  is_done = false;
  data_ping.forEach(function (host) {
    let promise = ping.promise.probe(host.host, {
      timeout: 2
    })
      .then(function (new_host) {
        if (!new_host.alive) {
          new_host.host = host.host;
        }
        if (host.alive != new_host.alive) {
          let strtext = new_host.alive ? "alive" : "die";
          console.log(new_host.host, ": " + strtext);
          new_host.time_change = moment().format();
          io.emit("status", new_host);
          save_host(new_host);
        }
        return new_host;
      });
    promiseAll.push(promise);
  });
  Promise.all(promiseAll).then(function (results) {
    is_done = true;
    console.log("Saved!");
  })
}, 10000);

function save_host(new_host) {
  for (let i = 0; i < data_ping.length; i++) {
    if (data_ping[i].host == new_host.host) {
      data_ping[i] = new_host;
      break;
    }
  }
  jsonfile.writeFileSync('./data.json', data_ping, { spaces: 2 });
}
function save_db() {
  jsonfile.writeFileSync('./data.json', data_ping, { spaces: 2 });
}
if (false) {
  for (i = 1; i < 254; i++) {
    let host = { host: "192.168.1." + i };
    data_ping.push(host);
    save_db();
  }
}