var koa = require('koa');
var route = require('koa-route');
var logger = require('koa-logger');

// Create the app


var app =  module.exports = koa();


// gestor d'errors
app.use(function *(next){
    try{
        yield next; //pass on the execution to downstream middlewares
    } catch (err) { //executed only when an error occurs & no other middleware responds to the request
        this.type = 'json'; //optional here
        this.status = err.status || 500;
        this.body = { 'error' : 'The application just went bonkers'};
        //delegate the error back to application
        this.app.emit('error', err, this);
    }
});
// error handler
app.on('error', function(err){
    if (process.env.NODE_ENV != 'test') {
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
    }
});




// personalitzam page not found 404
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




// we'll use some very simple routes
app.use(route.get('/whosThere', noName));
app.use(route.get('/whosThere/:name', withName));

// Here's a couple of functions that returns some nice responses
function* noName() {
    var res = 'Sadly I cannot properly greet you, Anonymous';
    this.body = res;
};

function* withName(name) {
    name = decodeURI(name);
    var res = 'Ah, it is you! My old friend!\nHello ' + name;
    this.body = res;
};


app.use(function *(){
    throw new Error('boom boom');
});


app.use(logger());


if (!module.parent) app.listen(3000);