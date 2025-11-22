// A função principal que organiza a página
async function setupPage() {
    // --- 1. SELEÇÃO DE ELEMENTOS ---
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const logoutButton = document.getElementById('logout-button');
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    const headerFavoritesIcon = document.getElementById('header-favorites-icon');

    let isLoggedIn = false; // Começamos com o padrão 'não logado'

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
    } catch (error) {
        console.error("Erro ao verificar status de login:", error);
        isLoggedIn = false;
    }
    
    // --- 3. ATUALIZAÇÃO DA INTERFACE (HEADER) ---
    if (isLoggedIn) {
        guestMenu.classList.add('hidden');
        userMenu.classList.remove('hidden');
    } else {
        guestMenu.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }

    // --- CARREGAR DESTAQUES (DINÂMICO) ---
    await carregarDestaques();

    // --- 4. LÓGICA DE EVENTOS (CLICKS) ---

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
}

// --- FUNÇÃO PARA CARREGAR OS CARDS DE DESTAQUE ---
async function carregarDestaques() {
    const grid = document.querySelector('.featured-grid');
    if (!grid) return; // Só executa se a grade existir na página

    try {
        const response = await fetch('/api/infosuplementos/destaques');
        const produtos = await response.json();

        grid.innerHTML = ''; 

        if (produtos.length === 0) {
            grid.innerHTML = '<p>Nenhum produto em destaque no momento.</p>';
            return;
        }

        // Cria o HTML para cada produto (sem a tag <img>)
        produtos.forEach(product => {
            const card = document.createElement('div');
            card.className = 'supplement-card';
            card.setAttribute('data-id', product.id_suplemento);
            card.setAttribute('data-name', product.nome_produto);

            card.innerHTML = `
                <a href="#" class="favorite-icon" title="Adicionar aos Favoritos">
                    <i class="fa-regular fa-heart"></i>
                </a>
                <div class="card-content-no-image">
                  <h3>${product.nome_produto}</h3>
                  <p>Marca: ${product.marca}</p>
                </div>
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

// Executa tudo quando a página carrega
document.addEventListener('DOMContentLoaded', setupPage);