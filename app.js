const  express = require ("express");
const app = express();

const bodyparser= require ("body-parser");



const { json } = require("body-parser");

const methodoverride = require("method-override");
app.use(methodoverride());

app.use(bodyparser.json( {limit :'50mb'}));
app.listen(3000,()=>{console.log('servidor');
});

const mongoose = require('mongoose');

app.use(bodyparser.urlencoded({extended:false}));
mongoose.connect('mongodb://localhost:27017/angular2020',(err , res)=> {
    if  (err) throw err;
    console.log('conexion exitosa')
});

const router = express.Router();
app.use(bodyparser.json());

app.use(router);  


const jwt = require("jsonwebtoken");

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
});


const usuarioModel=require("./usuarioModel");



router.post("/login",(req,res) => {
    console.log('servicio login funcionando');
    console.log('req.params', req.body);
            
    usuarioModel.findOne({
                nombre: req.body.nombre, 
                password: req.body.password     
    },
    (error, respuesta)=>{
             if(error)res.send({ estado: false, token: ""});
             if(respuesta==null){
                res.send({ estado: false, token: ""});
             }
            else { 
                var token = generateAccessToken({ nombre: req.body.nombre });
                res.send({ estado: true, token: token})
            }                                  
    });
});
function generateAccessToken(username) {
            return jwt.sign(username, "estoEsUnaClaveSecreta", { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401) // if there isn't any token
        jwt.verify(token, "estoEsUnaClaveSecreta", (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next() // pass the execution off to whatever request the client intended
        })
    }

router.get("/usuario",authenticateToken, (req,res) => {console.log('servicio usuario funcionando');
    usuarioModel.find({},(error, respuesta)=>{
   
    if(error)res.send({estado:{codigo:0,respuesta:err.message}});
    res.send({estado:{codigo:0,respuesta:'buscar todos los uauarios exitoso'},usuarios:respuesta});
  });


});

    