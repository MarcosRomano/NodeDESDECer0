var mongoose = require("mongoose");
var Schema=mongoose.Schema;

 var usuarioSchema= new Schema ({
nombre : String, 
password : String, 
});

module.exports =mongoose.model( 'Usuario',usuarioSchema); 
