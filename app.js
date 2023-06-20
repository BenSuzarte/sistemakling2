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
  const ChamadoOpcoesService = require('./services/chamado/chamadoOpcoes_service');
  const ChamadoEnviarService = require('./services/chamado/chamadoEnviar_service')

//Instâncias
  const usuarioService = new UserService()
  const usuarioCrud = new UsuarioCrudService()
  const chamadoOpcoesService = new ChamadoOpcoesService()
  const chamadoEnviarService = new ChamadoEnviarService()

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
    app.get('/login', (req, res) => {
      res.render('login')
    })

    app.get('/gerente/usuarios', async (req, res) => {
      try {
        const results = await usuarioCrud.carregarUsuarios();
        res.render('usuarios-crud', { usuarios: results });
      } catch (error) {
        console.error(error);
        res.render('usuarios-crud', { usuarios: [] });
      }
    });

    app.get('/professor/novo-chamado', async (req, res) => {
      const resultsSetores = await chamadoOpcoesService.carregarSetores()
      const resultsBlocos = await chamadoOpcoesService.carregarBlocos()
      const resultsAparelhos = await chamadoOpcoesService.carregarAparelhos()
      res.render('professor-novo-chamado', { setores: resultsSetores, blocos: resultsBlocos, aparelhos: resultsAparelhos });
    })

    app.get('/tecnico', (req, res) => {
      res.render('tecnico-principal')
    })

  //POSTs
    app.post('/login', async (req, res) => {
      idUsuario = await usuarioService.requisitarIdUsuario(req.body.email, req.body.senha)
      const usuarioFuncao = await usuarioService.requisitarFuncaoUsuario(req.body.email, req.body.senha)

      if(usuarioFuncao !== null) {
        if (usuarioFuncao === 'PROFESSOR') {
          res.redirect('/professor/novo-chamado')
        } else if (usuarioFuncao === 'GERENTE') {
          res.redirect('/gerente/usuarios')
        } else if (usuarioFuncao === 'TECNICO') {
          //res.redirect('/tecnico')
        }
      } else {
        console.log('Erro de autenticação!!!')
      }
    })

    app.post('/professor/novo-chamado', (req, res) => {

      chamadoEnviarService.chamadoEnviar(
        req.body.setor,
        req.body.bloco,
        req.body.sala,
        req.body.aparelho,
        req.body.numero,
        req.body.descricao,
        idUsuario
      )

      res.redirect('/professor/novo-chamado')
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