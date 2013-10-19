var express = require('express');
var qs = require('querystring');

var app = express();

app.get('/', function(req, res) {
  res.sendfile('./sample/index.html');
});

app.post('/tags', function(req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var POST = qs.parse(body);
    var tag = {
      name: POST.value,
      imgWidth: POST.imgWidth,
      imgHeight: POST.imgHeight,
      x: POST.x,
      y: POST.y,
      width: POST.width,
      height: POST.height
    };
    res.json(tag);
  });
});

module.exports = app;