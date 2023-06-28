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
  const ChamadoEnviarService = require('./services/chamado/chamadoEnviar_service');
  const CarregarChamados = require('./services/chamado/carregarChamado_service');
  const FinalizarInformacoes = require('./services/tecnico/finalizarInformacoes_service');

//Instâncias
  const usuarioService = new UserService()
  const usuarioCrud = new UsuarioCrudService()
  const chamadoOpcoesService = new ChamadoOpcoesService()
  const chamadoEnviarService = new ChamadoEnviarService()
  const carregarChamados = new CarregarChamados();
  const finalizarInformacoes = new FinalizarInformacoes()

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

    app.get('/gerente/salas', async (req, res) => {
      res.render('salas-crud')
    })

    app.get('/gerente/index', async (req, res) => {
      res.render('index-gerente')
    })
    
    app.get('/professor/novo-chamado', async (req, res) => {
      const resultsSetores = await chamadoOpcoesService.carregarSetores()
      const resultsBlocos = await chamadoOpcoesService.carregarBlocos()
      const resultsAparelhos = await chamadoOpcoesService.carregarAparelhos()
      res.render('professor-novo-chamado', { setores: resultsSetores, blocos: resultsBlocos, aparelhos: resultsAparelhos });
    })

    app.get('/professor/meus-chamados', async (req, res) => {
      const results = await carregarChamados.carregarChamados(idUsuario)
      res.render('chamados-professor', { results: results })
    })

    app.get('/tecnico/finalizar-chamado', async (req, res) => {
      const idChamado = await finalizarInformacoes.requisitarChamadoID(idUsuario)
      const infoChamado = await finalizarInformacoes.requisitarInformacoesDoChamado(idChamado)
      const infoUsuario = await finalizarInformacoes.requisitarInformacoesDoUsuario(infoChamado[0].idUsuario)
      res.render('finalizar-chamado', /*{infoChamado: infoChamado, infoUsuario: infoUsuario}*/)
    })

    app.get("/tecnico/chamados", async (req, res) => {
      const results = await carregarChamados.carregarTodosChamados()
      res.render('tecnico-principal', { results: results })
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
          res.redirect('/tecnico/chamados')
        }
      } else {
        
        res.render('login')
        
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

      res.redirect('/professor/meus-chamados')
    })

    app.post('/gerente/usuarios-cadastrar', (req, res) => {
      usuarioCrud.cadastrarUsuario(req.body.funcao, req.body.nome, req.body.email, req.body.telefone)
      res.redirect('/gerente/usuarios')
    })

    app.post('/gerente/deletar-usuario', (req, res) => {
      usuarioCrud.deletarUsuario(req.body.deleteId)
      res.redirect('/gerente/usuarios')
    })

    app.post('/gerente/editar-usuario', (req, res) => {
      usuarioCrud.editarUsuario(req.body.id, req.body.funcao, req.body.nome, req.body.email, req.body.tel)
      res.redirect('/gerente/usuarios')
    })

    app.post('/tecnico/chamados', async (req, res) => {
      const results = await carregarChamados.carregarChamadoPeloID(req.body.id)
      const tecnicos = await finalizarInformacoes.requisitarTecnicoNomeID()

      res.render('finalizar-chamado', ({results: results, tecnicos: tecnicos}))
    })

    app.post('/tecnico/finalizar-chamado', async (req, res) => {
      const dataFechamento = finalizarInformacoes.capturarDataHoraLocal()
      let horas
      let minutos
      if(parseInt(req.body.horas) < 10) {
        horas = '0' + `${req.body.horas}`
      } else {
        horas = req.body.horas
      }

      if(parseInt(req.body.horas) < 10) {
        minutos = '0' + `${req.body.minutos}`
      } else {
        minutos = req.body.minutos
      }

      const tempoDeRealizacao = `${horas}:${minutos}:00`
      finalizarInformacoes.concluirChamado(req.body.id, dataFechamento, tempoDeRealizacao, req.body.relatorio)

      res.redirect('/tecnico/chamados')
    })

//Inicialização
  app.listen(8080, () => {
    console.log('Servidor Rodando: http://localhost:8080/login');
  })