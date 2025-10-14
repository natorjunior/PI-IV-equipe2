CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    tipo_usuario ENUM('administrador', 'comum') NOT NULL,
    status_usuario ENUM('ativo', 'inativo') NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suplementos (
    id_suplemento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_cadastro INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    tipo_suplemento ENUM('whey_protein', 'creatina') NOT NULL,
    status_suplemento ENUM('ativo', 'inativo') NOT NULL,
    status_aprovacao ENUM('aprovado', 'reprovado') NOT NULL,
    detalhes_laudo TEXT,
    orgao_laudo VARCHAR(100),
    data_laudo DATE,
    data_cadastro_sistema TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
    
);


CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
    id_suplemento INT NOT NULL,
	data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_suplemento) REFERENCES suplementos(id_suplemento)
        
);

CREATE TABLE IF NOT EXISTS midias (
    id_midia INT AUTO_INCREMENT PRIMARY KEY,
    id_suplemento INT NOT NULL,
    tipo_midia ENUM('imagem', 'video') NOT NULL,
    nome VARCHAR(255) NOT NULL,
    caminho_midia VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_suplemento) REFERENCES suplementos(id_suplementos)

);


//TESTEGIT