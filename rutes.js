/* *
* rutes securitzades de l'aplicació
*/
var router = require('koa-router');
var mount = require('koa-mount');

// exemples
var exemple = require('./proves/exemples/exemple1/exemple1.js');


exports.carregaRutes = function(app, app_dir) {


    // totes les routes que posem a partir d'ara són securitzades

    // arrel
    var general = new router();
    general.get('/', require('./app/index').getIndex);

    app.use(mount(app_dir+'', general.middleware()));



    // albarans
    var albaranes = new router();
    albaranes.get('/whosThere', exemple.noName);
    albaranes.get('/whosThere/:name', exemple.withName);
    albaranes.get('/whosThere/:nombre/:apellidos', exemple.otra);

    app.use(mount(app_dir+'/albaranes', albaranes.middleware()));



}; // fi de carregaRutes
