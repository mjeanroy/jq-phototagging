var express = require('express');
var qs = require('querystring');

var app = express();

var elephant = {
  id: 1,
  name: 'Elephant'
};

var horse = {
  id: 2,
  name: 'Horse'
};

var species = [elephant, horse];

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

app.get('/species', function(req, res) {
  var query = req.query;
  var filter = (query.filter || '').toLowerCase();

  var results = [];
  for (var i = 0, ln = species.length; i < ln; ++i) {
    var sp = species[i];
    if (sp.name.toLowerCase().indexOf(filter) >= 0) {
      results.push(sp);
    }
  }

  res.json(results);
});

app.post('/species', function(req, res) {
  var body = '';
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    var POST = qs.parse(body);

    var newId = species[species.length - 1].id;
    newId++;

    var sp = {
      id: newId,
      name: POST.name
    };
 
    species.push(sp);
    res.json(sp);
  });
});

module.exports = app;