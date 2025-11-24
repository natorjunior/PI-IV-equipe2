document.addEventListener('DOMContentLoaded', async () => {
    // 1. Pegar o ID da URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (!id) {
        alert("Produto não especificado.");
        window.location.href = "index.html";
        return;
    }

    try {
        // 2. Chamar a API do Back-end
        const response = await fetch(`/api/suplementos/${id}`);
        
        if (!response.ok) throw new Error("Erro ao buscar produto");

        const product = await response.json();

        // 3. Esconder 'Carregando' e Mostrar o Container
        document.getElementById('loading-msg').classList.add('hidden');
        document.getElementById('product-detail-container').classList.remove('hidden');

        // 4. Preencher os Dados
        
        // Imagem (usa o placeholder se não tiver imagem no banco)
        // Note que sua tabela 'midias' guarda o caminho, ex: 'resources/whey_generico.jpg'
        const imgUrl = product.imagem_url || 'resources/logo.png';
        document.getElementById('detail-img').src = imgUrl;
        
        document.getElementById('detail-name').textContent = product.nome;
        document.getElementById('detail-brand').textContent = product.marca;
        document.getElementById('detail-type').textContent = product.tipo_suplemento;
        document.getElementById('detail-org').textContent = product.orgao_laudo || "Não informado";
        document.getElementById('detail-text').textContent = product.detalhes_laudo || "Nenhum detalhe adicional informado.";

        // Formatar Data (se existir)
        if (product.data_laudo) {
            // Cria a data e formata para dia/mês/ano
            const dataObj = new Date(product.data_laudo);
            document.getElementById('detail-date').textContent = dataObj.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
        } else {
            document.getElementById('detail-date').textContent = "Data não informada";
        }

        // Estilizar o Status (Verde para Aprovado, Vermelho para Reprovado)
        const statusEl = document.getElementById('detail-status');
        statusEl.textContent = product.status_aprovacao;
        
        if (product.status_aprovacao === 'APROVADO') {
            statusEl.className = 'status-badge status-aprovado';
            statusEl.style.backgroundColor = '#d4edda'; // Fundo verde claro
            statusEl.style.color = '#155724';
        } else {
            statusEl.className = 'status-badge status-reprovado';
            statusEl.style.backgroundColor = '#f8d7da'; // Fundo vermelho claro
            statusEl.style.color = '#721c24';
        }

    } catch (error) {
        console.error(error);
        document.getElementById('loading-msg').textContent = "Erro ao carregar informações do produto. Tente novamente.";
    }
});