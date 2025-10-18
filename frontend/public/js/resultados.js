document.addEventListener('DOMContentLoaded', async () => {
    // Pega os parâmetros da URL. Ex: se a URL é "...?q=creatina", params.get('q') retorna "creatina"
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    const title = document.getElementById('search-title');
    const grid = document.getElementById('results-grid');
    const noResultsMessage = document.getElementById('no-results-message');

    if (!query) {
        title.textContent = "Por favor, digite um termo na barra de busca.";
        return;
    }

    title.textContent = `Resultados da Busca por: "${query}"`;

    try {
        // Faz a chamada para a rota de busca no seu back-end (/api/infosuplementos/search)
        const response = await fetch(`/api/infosuplementos/search?q=${query}`);
        const results = await response.json();

        if (results.length === 0) {
            noResultsMessage.classList.remove('hidden');
        } else {
            grid.innerHTML = '';
            results.forEach(product => {
                const card = document.createElement('div');
                card.className = 'supplement-card';
                card.setAttribute('data-id', product.id_suplemento);
                card.setAttribute('data-name', product.nome_produto);
                // Adicione data-image se tiver a coluna no banco
                // card.setAttribute('data-image', product.imagem_url); 

                card.innerHTML = `
                    <a href="#" class="favorite-icon" title="Adicionar aos Favoritos"><i class="fa-regular fa-heart"></i></a>
                    <h3>${product.nome_produto}</h3>
                    <p>Marca: ${product.marca}</p>
                    <p class="status-${product.status_aprovacao.toLowerCase()}">Status: ${product.status_aprovacao}</p>
                    <div class="card-footer">
                        <a href="#" class="buy-button">Ver Detalhes</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Erro ao buscar resultados:', error);
        title.textContent = "Ocorreu um erro ao realizar a busca.";
    }
});