const express = require('express');             //Importar module Express - rotas
const mongoose = require('mongoose');           //Importar module Mongoose - Banco de dados MongoDB
var bodyParser = require('body-parser');        //importar module Body-parser - Decodificar

const path = require('path');                   //Importar module path - caminhos

const app = express();                             //Chama de funções do express

const Games = require('./Games.js');
const Girls = require('./Girls.js');
const Tasks = require('./Tasks.js');
const VarSaves = require('./VarSaves.js');
const { nextTick } = require('process');

mongoose.connect('mongodb+srv://userdata:qKta8ouKum1YhGlj@cluster0.gnmx1ae.mongodb.net/Qtracker?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true}).then(function(){
    console.log('banco de dados conectado');
}).catch(function(err){
    console.log(err.message);
})

app.use(bodyParser.json());             //suportar JSON-enconded bodies
app.use(bodyParser.urlencoded({         //suportar URL-encoded bodies
    extended: true
}));

app.engine('html', require('ejs').renderFile);      //Configura tipo de renderização do arquivo
app.set('view engine','html');                      //Configura a engine de visualização
app.use('/public', express.static(path.join(__dirname,'public'))); //Registra caminho para diretório public
app.set('views', path.join(__dirname,'/views'));    //Configura pasta de acesso às views (páginas ao cliente)

app.get('/',(req,res)=>{
    Games.find({}).sort({'game':1}).exec(function(err, myGames){
        res.render('home',{mySaves: myGames});
    })
});

app.get('/favicon.ico',(req ,res)=>{
});

app.get('/:slug',(req ,res)=>{
    if (req.query.time == null) {
        Girls.find({slug: req.params.slug}).sort('name').exec(function(err,girlsList){
            VarSaves.find({slug: req.params.slug}).sort('name').exec(function(err,varList){    
                Tasks.find({slug: req.params.slug}).sort('codquest').exec(function(err,taskList){    
                    res.render('tracker',{girls: girlsList, reqs: varList, tasks: taskList});
                });
            });
        });
    } else {
        Girls.find({slug: req.params.slug}).sort('name').exec(function(err,girlsList){
            VarSaves.find({slug: req.params.slug}).sort('name').exec(function(err,varList){    
                Tasks.find({slug: req.params.slug, complete: false, time: {$regex: req.query.time,$options:"i"}}).sort('codquest').exec(function(err,taskList){
                    res.render('tracker',{girls: girlsList, reqs: varList, tasks: taskList});
                });
            });
        });
    }
});

app.listen(5000, ()=>{
    console.log('Servidor rodando!');
})