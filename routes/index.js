var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  data_ping = data_ping.sort(function (a, b) {
    if (a.alive == b.alive)
      return 0;
    return a.alive < b.alive ? 1 : -1;
  })
  res.render('index', { title: 'Ping', ping: data_ping });
});

module.exports = router;
