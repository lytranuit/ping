var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile')
var moment = require("moment");
const ping = require('ping');


router.post('/addhost', async function (req, res, next) {
  let host = req.body.host;
  host = await ping.promise.probe(host, { timeout: 2 });
  host.time_change = moment().format();
  ///
  data_ping.push(host);
  jsonfile.writeFileSync('./data.json', data_ping, { spaces: 2 });
  ///
  res.json({ success: 1 });
});

router.post('/removehost', function (req, res, next) {
  let host = req.body.host;
  for (let i = 0; i < data_ping.length; i++) {
    let ping = data_ping[i];
    if (ping.host == host) {
      data_ping.splice(i, 1);
      break;
    }
  }
  jsonfile.writeFileSync('./data.json', data_ping, { spaces: 2 });
  ///
  res.json({ success: 1 });
});

module.exports = router;
