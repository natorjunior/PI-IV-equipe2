// A função principal que organiza a página
async function setupPage() {
    // --- 1. SELEÇÃO DE ELEMENTOS ---
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const logoutButton = document.getElementById('logout-button');
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    const headerFavoritesIcon = document.getElementById('header-favorites-icon');

    let isLoggedIn = false; // Começamos com o padrão 'não logado'
    let user = null;

    // --- LÓGICA DO POPUP DE PRIVACIDADE
    const privacyPopup = document.getElementById('privacy-popup');
    const acceptPrivacyBtn = document.getElementById('accept-privacy-btn');

    if (privacyPopup && acceptPrivacyBtn) {
        // Verifica no localStorage se o usuário JÁ aceitou
        const hasAcceptedPrivacy = localStorage.getItem('infoSuplementosPrivacyAccepted');

        if (!hasAcceptedPrivacy) {
            // Se NÃO houver registro, mostra o popup
            privacyPopup.classList.remove('hidden');
        }

        // Adiciona o evento de clique ao botão de aceitar
        acceptPrivacyBtn.addEventListener('click', () => {
            // Salva a aceitação no localStorage para futuras visitas
            localStorage.setItem('infoSuplementosPrivacyAccepted', 'true');
            // Esconde o popup
            privacyPopup.classList.add('hidden');
        });
    }

    // --- 2. VERIFICAÇÃO DE STATUS NO SERVIDOR (A NOVA "FONTE DA VERDADE") ---
    try {
        const response = await fetch('/api/auth/status', { credentials: 'include' });
        const data = await response.json();
        isLoggedIn = data.loggedIn; // Atualiza nosso status com a resposta REAL do servidor
        user = data.user;
    } catch (error) {
        console.error("Erro ao verificar status de login:", error);
        isLoggedIn = false;
        user = null;
    }

    // --- 3. LINK DE ADMIN (Lógica Segura) ---
    const headerNav = document.querySelector('.header-left nav ul');
    // Remove botão admin antigo se existir para não duplicar
    const existingAdminBtn = document.getElementById('admin-link-li');
    if(existingAdminBtn) existingAdminBtn.remove();

    // Verifica se está logado E se o objeto user existe E se o tipo é ADMINISTRADOR
    if (isLoggedIn && user && user.tipo === 'ADMINISTRADOR') {
        const li = document.createElement('li');
        li.id = 'admin-link-li';
        li.innerHTML = '<a href="admin.html" style="color: #e67e22; font-weight: bold;">Admin</a>';
        headerNav.appendChild(li);
    }
    
    // --- 4. ATUALIZAÇÃO DA INTERFACE (HEADER) ---
    if (isLoggedIn) {
        guestMenu.classList.add('hidden');
        userMenu.classList.remove('hidden');
    } else {
        guestMenu.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }

    // --- 5. CARREGAR DESTAQUES (DINÂMICO) ---
    await carregarDestaques();

    // --- 6. LÓGICA DE EVENTOS (CLICKS) ---

    // Logout
    if (logoutButton) {
        logoutButton.addEventListener('click', async (event) => {
            event.preventDefault();
            // Avisa o servidor para destruir a sessão
            await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
            // Redireciona para a página de login
            window.location.href = '/login.html';
        });
    }

    // Evento para o ícone de favoritos do CABEÇALHO
    if (headerFavoritesIcon) {
        headerFavoritesIcon.addEventListener('click', (event) => {
            event.preventDefault();
            if (!isLoggedIn) {
                alert('É necessário fazer o login para ver seus favoritos.');
            } else {
                window.location.href = 'favoritos.html';
            }
        });
    }

    // Evento para os ícones de favorito dos CARDS (usando delegação)
    const grid = document.querySelector('.featured-grid');
    if (grid) {
        grid.addEventListener('click', async (event) => {
            const favoriteIcon = event.target.closest('.favorite-icon');
            if (!favoriteIcon) return; // Sai se o clique não foi no ícone

            event.preventDefault();

            if (!isLoggedIn) {
                alert('É necessário fazer o login para adicionar produtos aos favoritos.');
                return;
            }
                  
            const card = event.target.closest('.supplement-card');
            const suplementoId = card.dataset.id;
            const suplementoNome = card.dataset.name;

            try {
                // Chama a API de favoritos do back-end
                const response = await fetch('/api/infosuplementos/favoritos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ suplementoId: parseInt(suplementoId) })
                });
                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    favoriteIcon.querySelector('i').classList.replace('fa-regular', 'fa-solid');
                    favoriteIcon.querySelector('i').style.color = 'var(--logout-color)';
                }
            } catch (error) {
                console.error('Erro ao favoritar item:', error);
            }
        });
    }

// --- 7. LÓGICA DE BUSCA COM FILTRO ---
    const searchForm = document.querySelector('.search-bar form');
    const categorySelect = document.getElementById('category-select');

    if (searchForm && categorySelect) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault(); 

            const term = searchForm.querySelector('input').value;
            const category = categorySelect.value;

            window.location.href = `resultados.html?q=${encodeURIComponent(term)}&category=${encodeURIComponent(category)}`;
        });
    }
}

// --- FUNÇÃO AUXILIAR: CARREGAR DESTAQUES ---
async function carregarDestaques() {
    const grid = document.querySelector('.featured-grid');
    // Se não houver grade (ex: página de contato), sai da função
    if (!grid) return; 

    try {
        const response = await fetch('/api/infosuplementos/destaques');
        const produtos = await response.json();

        grid.innerHTML = ''; 

        if (produtos.length === 0) {
            grid.innerHTML = '<p>Nenhum produto em destaque no momento.</p>';
            return;
        }

        produtos.forEach(product => {
            const card = document.createElement('div');
            card.className = 'supplement-card';
            card.setAttribute('data-id', product.id_suplemento);
            card.setAttribute('data-name', product.nome_produto);

            const imgUrl = product.imagem_url || 'resources/logo.png';

            card.innerHTML = `
                <a href="#" class="favorite-icon" title="Adicionar aos Favoritos">
                    <i class="fa-regular fa-heart"></i>
                </a>
                <img src="${imgUrl}" alt="${product.nome_produto}" class="product-image">
                <h3>${product.nome_produto}</h3>
                <p class="product-brand">${product.marca}</p>
                <div class="card-footer">
                    <a href="detalhes.html?id=${product.id_suplemento}" class="buy-button">Ver Detalhes</a>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        grid.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', setupPage);