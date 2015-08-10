/* * * *
*   Estratègies per fer auth
 */


exports.setSecurity = function (app, app_dir) {
    // trust proxy
    app.proxy = true

    // sessions
    var session = require('koa-generic-session')
    app.keys = ['yoasdfq345ASDGgasdur-session-secret']
    app.use(session())

    // body parser
    var bodyParser = require('koa-bodyparser')
    app.use(bodyParser())

    // authentication
    //require('./auth')
    var passport = require('koa-passport')
    app.use(passport.initialize())
    app.use(passport.session())



    /* *
     *
     * Rutes estàtiques
     *
     */
    app.use(require('koa-static')(__dirname + '/public', {}));


    /* * * *
     *
     * Rutes publiques de l'aplicació (sense ver d'estar auth)
     */
    var publiques = require('./rutes-publiques')
    publiques.carregaRutesPubliques(app, passport)


    var user = { id: 1, username: 'test' }

    passport.serializeUser(function(user, done) {
        done(null, user.id)
    });

    passport.deserializeUser(function(id, done) {
        done(null, user)
    });

    // estratègia d'authentificació local
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(function(username, password, done) {
        console.log('autienticant usuari...');
        // retrieve user ...
        if (username === 'test' && password === 'test') {
            console.log(this.state);
            console.log("autenticat!");
            done(null, username)
        } else {
            done(null, false);
        }
    }));


    /* * * *
     *
     * Rutes securitzades
     *
     * A partir d'aquest punt totes les rutes hauran de tenir usuari logejat
     */

    // Require authentication for now
    app.use(function*(next) {
        if (this.isAuthenticated()) {
            yield next;
        } else {
            this.redirect('/');
        }
    });


    var rutes = require('./rutes.js');

    // carregam les rutes del router securitzades
    rutes.carregaRutes(app, app_dir);




}