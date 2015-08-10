// rutes de l'aplicació
var route = require('koa-route');

// exemples
var exemple = require('./proves/exemples/exemple1/exemple1.js');


exports.carregaRutes = function(app) {

    app.use(route.get('/whosThere', exemple.noName));
    app.use(route.get('/whosThere/:name', exemple.withName));
    app.use(route.get('/whosThere/:nombre/:apellidos', exemple.otra));

}; // fi de carregaRutes
