// platilla de creació de mòduls
var util = require('util')


// mos asseguram que apunten al mateix
var exports = module.exports = {};

// sempre cream les funcions amb la sintaxi
//var nomfunc = function *()

// si this.user no te valor, salta excepció
//this.assert(this.user, 401, 'User not found. Please login!');

var otra = function *(nombre, apellidos) {
    if (apellidos=='v')
        this.throw("Faltan los apellidos"); // estandar per saltar errors
    this.body = util.format('ud es %s, %s', apellidos, nombre);
}


module.exports = {

    otra: otra,


    // Here's a couple of functions that returns some nice responses
    noName : function *()
    {
        var res = 'Sadly I cannot properly greet you, Anonymous';
        this.body = res;
    },

    withName : function *(name)
    {
        name = decodeURI(name);
        var res = 'Ah, it is you! My old friend!\nHello ' + name;
        this.body = res;
    }

}



