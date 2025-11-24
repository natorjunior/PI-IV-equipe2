const db = require("../connection");

// CRIAR PRODUTO (INSERT em Suplementos + INSERT em Midias)
exports.criarProduto = async (req, res) => {
    const idUsuario = req.session.usuario.id;
    const { 
        nome, marca, tipo_suplemento, status_aprovacao, 
        detalhes_laudo, orgao_laudo, data_laudo, imagem_url 
    } = req.body;

    try {
        // 1. Inserir o Suplemento
        const sqlSuplemento = `
            INSERT INTO suplementos 
            (id_usuario_cadastro, nome, marca, tipo_suplemento, status_suplemento, status_aprovacao, detalhes_laudo, orgao_laudo, data_laudo)
            VALUES (?, ?, ?, ?, 'ATIVO', ?, ?, ?, ?)
        `;
        
        // Executa a query e pega o resultado para ter o ID gerado (insertId)
        const [result] = await db.query(sqlSuplemento, [
            idUsuario, nome, marca, tipo_suplemento, status_aprovacao, detalhes_laudo, orgao_laudo, data_laudo
        ]);
        
        const novoIdSuplemento = result.insertId;

        // 2. Inserir a Imagem na tabela Midias (se houver URL)
        if (imagem_url) {
            const sqlMidia = `
                INSERT INTO midias (id_suplemento, tipo_midia, nome, caminho_midia)
                VALUES (?, 'IMAGEM', ?, ?)
            `;
            await db.query(sqlMidia, [novoIdSuplemento, nome, imagem_url]);
        }

        res.status(201).json({ message: "Produto cadastrado com sucesso!", id: novoIdSuplemento });

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        res.status(500).json({ message: "Erro ao criar produto." });
    }
};

// EXCLUIR PRODUTO
exports.deletarProduto = async (req, res) => {
    const { id } = req.params;

    try {
        // Como configuramos ON DELETE CASCADE no banco, deletar o suplemento
        // vai deletar automaticamente os favoritos e as mídias associadas.
        const sql = "DELETE FROM suplementos WHERE id_suplemento = ?";
        await db.query(sql, [id]);

        res.json({ message: "Produto excluído com sucesso!" });

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        res.status(500).json({ message: "Erro ao excluir produto." });
    }
};

// EDITAR PRODUTO (Básico)
exports.editarProduto = async (req, res) => {
    const { id } = req.params;
    const { nome, marca, status_aprovacao, imagem_url } = req.body;

    try {
        // Atualiza dados básicos
        const sqlUpdate = "UPDATE suplementos SET nome = ?, marca = ?, status_aprovacao = ? WHERE id_suplemento = ?";
        await db.query(sqlUpdate, [nome, marca, status_aprovacao, id]);

        // Atualiza imagem (se fornecida)
        if (imagem_url) {
            // Verifica se já existe imagem
            const [midiaExistente] = await db.query("SELECT id_midia FROM midias WHERE id_suplemento = ? AND tipo_midia = 'IMAGEM'", [id]);
            
            if (midiaExistente.length > 0) {
                await db.query("UPDATE midias SET caminho_midia = ? WHERE id_suplemento = ? AND tipo_midia = 'IMAGEM'", [imagem_url, id]);
            } else {
                await db.query("INSERT INTO midias (id_suplemento, tipo_midia, nome, caminho_midia) VALUES (?, 'IMAGEM', ?, ?)", [id, nome, imagem_url]);
            }
        }

        res.json({ message: "Produto atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao editar produto:", error);
        res.status(500).json({ message: "Erro ao editar produto." });
    }
};