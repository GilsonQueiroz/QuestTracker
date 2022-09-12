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

var session = require('express-session');

mongoose.connect('mongodb+srv://userdata:qKta8ouKum1YhGlj@cluster0.gnmx1ae.mongodb.net/Qtracker?retryWrites=true&w=majority',{useNewUrlParser:true, useUnifiedTopology:true}).then(function(){
    console.log('banco de dados conectado');
}).catch(function(err){
    console.log(err.message);
})

app.use(bodyParser.json());             //suportar JSON-enconded bodies
app.use(bodyParser.urlencoded({         //suportar URL-encoded bodies
    extended: true
}));

app.use(session({ 
    secret:'Keep it secret', 
    cookie: { maxAge: 60000 }
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

app.get('/:slug',(req, res)=>{
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

var usuarios = [
    {
        login: 'Gilson',
        senha: '96321'
    }
]

app.get('/admin/login',(req, res)=>{
    if(req.session.login == null){
        res.render('admin-login');
    } else {
        Games.find({}).sort({'game':1}).exec(function(err, myGames){
            res.render('admin-painel',{mySaves: myGames});
        })
    }
})

app.post('/admin/cadastro',(req,res)=>{
    Games.create({
        game: req.body.game_name,
        slug: req.body.game_slug,
        initialDay: req.body.initial_day,
        actualDay: req.body.actual_day
    });
    res.redirect('/admin/login');
})

app.get('/admin/deletar/:id',(req,res)=>{
    Games.deleteOne({_id:req.params.id}).then(function(){
        res.redirect('/admin/login');
    });
})

app.post('/admin/login',(req, res)=>{
    usuarios.map(function(val){
        if (val.login == req.body.login && val.senha == req.body.senha){
            req.session.login = val.login;
        }
        res.redirect('/admin/login');
    })
})

app.listen(5000, ()=>{
    console.log('Servidor rodando!');
})