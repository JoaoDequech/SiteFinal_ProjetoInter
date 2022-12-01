-- Esse script vale para o MySQL 8.x. Se seu MySQL for 5.x, precisa executar essa linha comentada:
-- CREATE DATABASE IF NOT EXISTS propriedades;
CREATE DATABASE IF NOT EXISTS propriedades DEFAULT CHARACTER SET utf8mb4 DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE propriedades;

CREATE TABLE modalidade (
  idmodalidade int NOT NULL,
  nome varchar(50) NOT NULL,
  PRIMARY KEY (idmodalidade)
);

INSERT INTO modalidade (idmodalidade, nome) VALUES (1, 'Aluguel'), (2, 'Venda'), (3, 'Aluguel/Venda');

CREATE TABLE propriedade (
  id int NOT NULL AUTO_INCREMENT,
  idmodalidade int NOT NULL,
  nome varchar(50) NOT NULL,
  preco int NOT NULL,
  areatotal int NOT NULL,
  areaconstruida int NOT NULL,
  comodos int NOT NULL,
  piscinas int NOT NULL,
  vagas int NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY nome_UN (nome)
);
