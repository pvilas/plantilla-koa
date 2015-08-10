/*var monk = require('monk');
var wrap = require('co-monk');
var db = monk('localhost/mydb');
var words = wrap(db.get('words'));
*/
/**
 * GET all the results.
 */
exports.all = function *(){
    this.body = 'es all';
    if(this.request.query.word){
        //var res = yield words.find({ word : this.request.query.word });
        this.body = 'es all';
    } else {
        this.response.status = 404;
    }
};
/**
 * GET a single result.
 */
exports.single = function *(){
    this.body = 'es single';
    if(this.request.query.word){
        //var res = yield words.findOne({ word : this.request.query.word });
        this.body = 'es single';
    } else {
        this.response.status = 404;
    }
};