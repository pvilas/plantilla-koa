var koa = require('koa');
var settings = require('./settings.js');
var rutes = require('./rutes.js');

// Cream app
var app =  module.exports = koa();

// possam els settings de l'aplicació
settings.carregaModuls(app);

// carregam les rutes del router
rutes.carregaRutes(app);


if (!module.parent) app.listen(3000);