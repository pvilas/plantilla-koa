//
// Personalitzam els mòduls en la cadena de next

var util = require('util');
var logger = require('koa-logger');

exports.carregaModuls = function (app) {

    // variable global que recull variables per a totes les pàgines de jade
    jade_global = {}

    // directori de l'aplicació
    var app_dir = '/app';

    //
    // gestor d'errors
    //
    app.use(function *gestorErrors(next){
        try{
            yield next; //pass on the execution to downstream middlewares
        } catch (err) { //executed only when an error occurs & no other middleware responds to the request

            this.status = err.status || 500;

            switch (this.accepts('html', 'json')) {
                case 'html':
                    this.type = 'html';
                    this.body = util.format('<p>%s</p>', err.message);
                    break;
                case 'json':
                    this.body = {
                        message: err.message
                    };
                    break;
                default:
                    this.type = 'text';
                    this.body = err.message;
            }

            //delegate the error back to application
            this.app.emit('error', err, this);
        }
    });

    //
    // error handler, event de l'aplicació
    app.on('error', function(err){
        if (process.env.NODE_ENV != 'test') {
            console.log('sent error %s to the cloud', err.message);
            console.log(err);
        }
    });

    //
    // x-response-time
    // seteja el temps que ha tardat l'app en respondre
    app.use(function *(next){
        var start = new Date;
        yield next;
        var ms = new Date - start;
        this.set('X-Response-Time', ms + 'ms');
    });

    //
    // logger
    // logeja les ES
    app.use(function *(next){
        var start = new Date;
        yield next;
        var ms = new Date - start;
        console.log('%s %s - %s', this.method, this.url, ms);
    });

    //
    // personalitzam page not found 404
    // captura this.status i mira si és 404
    app.use(function *pageNotFound(next){
        yield next;

        if (404 != this.status) return;

        // we need to explicitly set 404 here
        // so that koa doesn't assign 200 on body=
        this.status = 404;

        switch (this.accepts('html', 'json')) {
            case 'html':
                this.type = 'html';
                this.body = '<p>Página no existe</p>';
                break;
            case 'json':
                this.body = {
                    message: 'Página no existe'
                };
                break;
            default:
                this.type = 'text';
                this.body = 'Página no existe';
        }
    })


    // no s'ha trobat un hadler que retorni cos
    // feim saltar excepció aposta
    /*
    app.use(function *(){
        this.throw("No se encontró un handler que retorne cuerpo");
        //throw new Error('No se encontró un handler que retorne cuerpo');
    });
    */


    // koa-logger
    app.use(logger());

    /* * * * *
    *
    * Renderitzador
    *
    * renderitzador de jade
    */
    var jade = require('koa-jade')


    app.use(jade.middleware({
        viewPath: __dirname + app_dir,
        debug: false,
        pretty: false,
        compileDebug: false,
        locals: jade_global,
        basedir: __dirname + app_dir + '/jade/extends',
        helperPath: [
            __dirname + app_dir+ '/jade/helpers',
            { random: __dirname + app_dir + '/jade/lib.js' },
            { _: require('lodash') }
        ]
    }))



    /* * * * * *
     *
     * Seguretat
     *
     */
    var auth = require('./auth')
    auth.setSecurity(app, app_dir)




};