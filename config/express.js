var mongoose = require('mongoose');
var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');

module.exports = function () {
  var app = express();

  app.set('port', 3000);
  app.set('secret', 'twitter_clone');

  // middlewares
  app.use(express.static('./public'));

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(require('method-override')());

  // set database
  mongoose.connect('mongodb://localhost/twitter_clone_dev');

  load('auth', { cwd: 'app' })
    .then('models')
    .then('controllers')
    .then('routes')
    .into(app);

  return app;
}
