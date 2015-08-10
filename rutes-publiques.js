/*
* Rutes publiques de l'apliació (sense haver d'iniciar sessió) 
 */


exports.carregaRutesPubliques = function (app, passport) {



    // publiques routes
    var Router = require('koa-router')

    var publiques = new Router()

    publiques.get('/', function * ()
    {
        this.render('login')
    }
    )

    publiques.post('/custom', function * (next)
    {
        var ctx = this;
        yield passport.authenticate('local', function * (err, user, info)
        {
            if (err) throw err
            if (user === false) {
                ctx.status = 401;
                ctx.body = {success: false}
            } else {
                yield ctx.login(user)
                ctx.body = {success: true}
            }
        }
    ).
        call(this, next)
    }
    )

    // POST /login
    publiques.post('/login', function*(next)
    {
        var ctx = this;
        yield * passport.authenticate('local', function * (err, user)
        {
            if (err) throw err;
            if (user === false) {
                ctx.status = 401;
                ctx.body = {success: false}
            } else {
                yield ctx.login(user)
                ctx.body = {success: true}
            }
            console.log("usuari es " + user);
        }
        ).call(this, next);
    });

    publiques.get('/logout', function * (next)
    {
        this.logout()
        this.redirect('/')
    }
    )

    publiques.get('/auth/facebook',
        passport.authenticate('facebook')
    )

    publiques.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/app',
            failureRedirect: '/'
        })
    )

    publiques.get('/auth/twitter',
        passport.authenticate('twitter')
    )

    publiques.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/app',
            failureRedirect: '/'
        })
    )

    publiques.get('/auth/google',
        passport.authenticate('google')
    )

    publiques.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/app',
            failureRedirect: '/'
        })
    )

    app.use(publiques.middleware())
}