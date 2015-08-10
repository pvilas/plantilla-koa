var koa = require('koa');
var settings = require('./settings.js');

// Cream app
var app =  module.exports = koa();

// possam els settings de l'aplicació
settings.carregaModuls(app);


if (!module.parent) app.listen(3000);