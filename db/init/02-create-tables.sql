CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suplementos (
    id_suplemento INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    tipo ENUM('WHEY_PROTEIN', 'CREATINA') NOT NULL,
    status_aprovacao ENUM('APROVADO', 'REPROVADO') NOT NULL,
    detalhes_laudo TEXT,
    orgao_laudo VARCHAR(100),
    data_laudo DATE,
    data_cadastro_sistema TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    id_admin_responsavel INT NOT NULL
    -- FOREIGN KEY (id_admin_responsavel) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS favoritos (
    id_usuario INT NOT NULL,
    id_suplemento INT NOT NULL,
    PRIMARY KEY (id_usuario, id_suplemento),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_suplemento) REFERENCES suplementos(id_suplemento) 
);