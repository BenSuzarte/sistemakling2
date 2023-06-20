create database sistemakling;
use sistemakling;

create table Usuario (
	idUsuario int unique auto_increment not null,
    nome varchar(100) not null,
    email varchar(100) not null,
    senha char(60) not null,
    telefone char(11) not null,
    funcao enum('PROFESSOR', 'GERENTE', 'TECNICO'),
primary key(idUsuario));

create table Disponibilidade (
	idDisponibilidade int not null auto_increment,
    disponibilidade enum('ATIVO', 'INATIVO') default 'ATIVO',
    idUsuario int not null, foreign key (idUsuario) references Usuario(idUsuario),
primary key (idDisponibilidade));

create table Setor (
	idSetor int unique auto_increment not null,
    setor varchar(20) not null,
primary key (idSetor));

create table Endereco (
	idEndereco int unique auto_increment not null,
    bloco char(1) not null,
    salas int not null,
primary key (idEndereco));

create table Aparelho (
	idAparelho int unique auto_increment not null,
    aparelho varchar(20) not null,
    quantidade int not null,
    idSetor int not null, foreign key (idSetor) references Setor(idSetor),
primary key (idAparelho));

create table Chamado (
	idChamado int unique auto_increment not null,
    dataCriacao datetime default current_timestamp,
    dataFechamento datetime,
    tempoDeRealizacao time,
    situacao enum('Pendente', 'Em Andamento', 'Finalizado') default 'Pendente',
    idTecnico int, foreign key (idUsuario) references Usuario(idUsuario),
    idSetor int not null, foreign key (idSetor) references Setor(idSetor),
    idEndereco int not null, foreign key (idEndereco) references Endereco(idEndereco),
    idAparelho int not null, foreign key (idAparelho) references Aparelho(idAparelho),
    idUsuario int not null, foreign key (idUsuario) references Usuario(idUsuario),
    descricao text,
    sala int not null,
primary key (idChamado));

insert into Usuario (nome, email, senha, telefone, funcao) values ('Juan Suzarte', 'juan@gmail.com', '#654321', '71999289030', 'GERENTE');
insert into Usuario (nome, email, senha, telefone, funcao) values ('Samuel Barengo', 'samuel@gmail.com', '#654321', '71999999999', 'PROFESSOR');
insert into Usuario (nome, email, senha, telefone, funcao) values ('Thiago Santos', 'thiago@gmail.com', '#654321', '71999999999', 'TECNICO');

insert into Disponibilidade (idUsuario) values (3);

insert into Setor (setor) values ('Refrigeração');
insert into Endereco (bloco, salas) values ('A', 20);
insert into Aparelho (aparelho, quantidade, idSetor) values ('Computador', 2, 1);
insert into Chamado (idSetor, idEndereco, idAparelho, idUsuario, descricao, sala) values (1, 1, 1, 2, 'Não liga!', 10);

SELECT setor FROM Setor;
SELECT * FROM Usuario;

delete from Usuario where idUsuario = 5;

select * from Usuario order by funcao asc;
select * from Disponibilidade;

drop database sistemakling;