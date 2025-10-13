// A função principal que organiza a página
async function setupPage() {
    // --- 1. SELEÇÃO DE ELEMENTOS ---
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const logoutButton = document.getElementById('logout-button');
    const favoriteIcons = document.querySelectorAll('.favorite-icon');
    const headerFavoritesIcon = document.getElementById('header-favorites-icon');

    let isLoggedIn = false; // Começamos com o padrão 'não logado'

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

    // Evento para os ícones de favorito dos CARDS
    favoriteIcons.forEach(icon => {
        icon.addEventListener('click', async (event) => {
            event.preventDefault();

            if (!isLoggedIn) {
                alert('É necessário fazer o login para adicionar produtos aos favoritos.');
                return;
            }
            
            // Lógica para salvar o favorito no back-end
            const card = event.target.closest('.supplement-card');
            const suplementoId = card.dataset.id;

            try {
                const response = await fetch('/api/suplementos/favoritos', { // Ajuste a URL se necessário
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ suplementoId: parseInt(suplementoId) })
                });
                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    const iconElement = event.target.closest('.favorite-icon').querySelector('i');
                    iconElement.classList.replace('fa-regular', 'fa-solid');
                    iconElement.style.color = 'var(--logout-color)';
                }
            } catch (error) {
                console.error('Erro ao favoritar item:', error);
                alert('Não foi possível adicionar aos favoritos.');
            }
        });
    });
}

// Executa tudo quando a página carrega
document.addEventListener('DOMContentLoaded', setupPage);
