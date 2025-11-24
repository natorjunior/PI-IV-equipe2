document.addEventListener("DOMContentLoaded", async () => {
    // 1. Pega os parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || ''; 
    const category = params.get('category') || 'all';

    const title = document.getElementById("search-title");
    const grid = document.getElementById("results-grid");
    const noResultsMessage = document.getElementById("no-results-message");

    // 2. Verifica status de login (para proteger o clique no favorito)
    let isLoggedIn = false;
    try {
        const statusResp = await fetch('/api/auth/status', { credentials: 'include' });
        const statusData = await statusResp.json();
        isLoggedIn = !!statusData.loggedIn;
    } catch (e) {
        isLoggedIn = false;
    }

    // 3. Atualiza o Título e Valida
    if (!query && category === 'all') {
        title.textContent = "Por favor, digite um termo ou selecione uma categoria.";
        return;
    }

    let tituloTexto = "Resultados";
    if (query) tituloTexto += ` para: "${query}"`;
    if (category !== 'all') tituloTexto += ` em ${category}`;
    title.textContent = tituloTexto;

    try {
        // 4. Faz a chamada para a API enviando AMBOS os parâmetros
        const url = `/api/infosuplementos/search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`;
        const response = await fetch(url);
        const results = await response.json();

        if (results.length === 0) {
            noResultsMessage.classList.remove("hidden");
            grid.innerHTML = "";
        } else {
            grid.innerHTML = "";
            
            results.forEach((product) => {
                const card = document.createElement("div");
                card.className = "supplement-card";
                card.setAttribute("data-id", product.id_suplemento);
                card.setAttribute("data-name", product.nome); 

                // Define a imagem (usa o placeholder se vier nulo)
                const imgUrl = product.imagem_url || 'resources/logo.png';

                card.innerHTML = `
                    <a href="#" class="favorite-icon" title="Adicionar aos Favoritos">
                        <i class="fa-regular fa-heart"></i>
                    </a>
                    <img src="${imgUrl}" alt="${product.nome}" class="product-image">
                    <h3>${product.nome}</h3>
                    <p class="product-brand">${product.marca}</p>
                    <p class="status-${product.status_aprovacao.toLowerCase()}">Status: ${product.status_aprovacao}</p>
                    <div class="card-footer">
                        <a href="detalhes.html?id=${product.id_suplemento}" class="buy-button">Ver Detalhes</a>
                    </div>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Erro ao buscar resultados:", error);
        title.textContent = "Ocorreu um erro ao realizar a busca.";
    }

    // 5. Lógica de Favoritar (Delegação de Eventos - FORA do loop e do try/catch da busca)
    grid.addEventListener('click', async (e) => {
        const anchor = e.target.closest('.favorite-icon');
        if (!anchor) return; // Se não clicou no coração, sai
        
        e.preventDefault();
        
        if (!isLoggedIn) { 
            alert('É necessário fazer o login para adicionar aos favoritos.'); 
            return; 
        }

        const card = anchor.closest('.supplement-card');
        const id = parseInt(card.getAttribute('data-id'));
        const icon = anchor.querySelector('i');
        const isOn = icon.classList.contains('fa-solid');

        try {
            if (isOn) {
                // Se já está cheio, remove (DELETE)
                // Note a URL corrigida para /api/suplementos/...
                await fetch(`/api/infosuplementos/favoritos/${id}`, { method: 'DELETE', credentials: 'include' });
                icon.classList.replace('fa-solid', 'fa-regular');
                icon.style.color = ''; // Volta a cor original
            } else {
                // Se está vazio, adiciona (POST)
                const res = await fetch('/api/infosuplementos/favoritos', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    credentials: 'include',
                    body: JSON.stringify({ suplementoId: id })
                });
                
                if (res.ok) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                    icon.style.color = 'var(--logout-color)'; // Fica vermelho
                } else {
                    const data = await res.json();
                    alert(data.message);
                }
            }
        } catch (err) { 
            console.error('Erro ao favoritar:', err); 
        }
    });
});