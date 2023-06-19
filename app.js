//Imports
  const express = require('express');
  const bodyParser = require('body-parser');
  const path = require('path');
  const session = require('express-session');
  const flash = require('connect-flash');

//Servidor
  const app = express();

//Services
  const UserService = require('./services/usuario/usuarioLogin_service');
  const UsuarioCrudService = require('./services/gerente/usuarioCrud_service');

//Instâncias
  const usuarioService = new UserService()
  const usuarioCrud = new UsuarioCrudService()

//Global
let idUsuario

//Config
    //Template Engine
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');

    //App Config
      //EJS Static
        app.use(express.static(path.join(__dirname, 'public')));

      //BodyParser
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(bodyParser.json());

      // Express Session
        app.use(session({
          secret: 'mysecretkey',
          resave: false,
          saveUninitialized: false
        }));

      // Connect Flash
        app.use(flash());

//Rotas
  //GETs
    app.get('/gerente/usuarios', async (req, res) => {
      try {
        const results = await usuarioCrud.carregarUsuarios();
        res.render('usuarios-crud', { usuarios: results });
      } catch (error) {
        console.error(error);
        res.render('usuarios-crud', { usuarios: [] });
      }
    });

    app.get('/professor/novo-chamado', (req, res) => {
      res.render('professor-novo-chamado');
    })

  //POSTs
    app.post('/login', async (req, res) => {
      idUsuario = await usuarioService.requisitarIdUsuario(req.body.email, req.body.senha)
      const usuarioFuncao = await usuarioService.requisitarFuncaoUsuario(req.body.email, req.body.senha)

      if(usuarioFuncao !== null) {
        if (usuarioFuncao === 'PROFESSOR') {
          res.redirect('/professor/novo-chamado')
        } else if (usuarioFuncao === 'GERENTE') {
          //res.redirect('/gerente')
        } else if (usuarioFuncao === 'TECNICO') {
          //res.redirect('/tecnico')
        }
      } else {
        console.log('Erro de autenticação!!!')
      }
    })

    app.post('/professor/novo-chamado', (req, res) => {

    })

    app.post('/gerente/usuarios-cadastrar', (req, res) => {
      usuarioCrud.cadastrarUsuario(req.body.funcao, req.body.nome, req.body.email, req.body.telefone)
      res.redirect('/gerente/usuarios')
    })

//Inicialização
  app.listen(8080, () => {
    console.log('Servidor Rodando: http://localhost:8080/login');
  })

module.exports = app;