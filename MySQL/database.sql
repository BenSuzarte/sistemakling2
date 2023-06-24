create database sistemakling;
use sistemakling;

create table Usuario (
    idUsuario int unique auto_increment not null,
    nome varchar(100) not null,
    email varchar(100) not null,
    senha char(60) not null,
    telefone varchar(20) not null,
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
    idSetor int not null, foreign key (idSetor) references Setor(idSetor),
    idEndereco int not null, foreign key (idEndereco) references Endereco(idEndereco),
    idAparelho int not null, foreign key (idAparelho) references Aparelho(idAparelho),
    idUsuario int not null, foreign key (idUsuario) references Usuario(idUsuario),
    descricao text,
    sala int not null,
primary key (idChamado));

create table tecnico_chamado(
    idTecnicoChamado int unique auto_increment not null,
    idChamado int not null, foreign key (idChamado) references Chamado(idChamado),
    idUsuario int not null, foreign key (idUsuario) references Usuario(idUsuario),
    primary key(idTecnicoChamado)
);

#Crio a tabela que vai guardar as notificações dos chamados a serem tratadas na aplicação
CREATE TABLE Chamado_Notifications (
    id int AUTO_INCREMENT PRIMARY KEY,
    idChamado int,
    notification_sent BOOLEAN DEFAULT FALSE
);

DELIMITER //
#Crio um procedure onde irá buscar o id de novos chamados inseridos na tabela, e incluir em Chamado_Notifications
CREATE PROCEDURE NotifyPython()
BEGIN
    DECLARE new_idChamado INT;
    
    SELECT MAX(idChamado) INTO new_idChamado FROM Chamado;
    
    INSERT INTO Chamado_Notifications (idChamado) VALUES (new_idChamado);
END//

DELIMITER ;

DELIMITER //
#Crio o gatilho para quando ouver uma inserção na table Chamado, e após isso chamo o Procedure.
CREATE TRIGGER Chamado_Insert_Trigger
AFTER INSERT ON Chamado
FOR EACH ROW
BEGIN
    CALL NotifyPython();
END//

DELIMITER ;

insert into Usuario (nome, email, senha, telefone, funcao) values ('Juan Suzarte', 'juan@gmail.com', '#654321', '71999289030', 'GERENTE');
insert into Usuario (nome, email, senha, telefone, funcao) values ('Samuel Barengo', 'samuel@gmail.com', '#654321', '71999999999', 'PROFESSOR');
insert into Usuario (nome, email, senha, telefone, funcao) values ('Thiago Santos', 'thiago@gmail.com', '#654321', '+5571992610389', 'TECNICO');
insert into Usuario (nome, email, senha, telefone, funcao) values ('Rafael Abreu', 'rafael@gmail.com', '#654321', '+5575998510556', 'TECNICO');

insert into Disponibilidade (idUsuario) values (4);
insert into Disponibilidade (idUsuario) values (3);

insert into Setor (setor) values ('Informática');
insert into Endereco (bloco, salas) values ('A', 20);
insert into Aparelho (aparelho, quantidade, idSetor) values ('Computador', 2, 1)

drop database sistemakling;