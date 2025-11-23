document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-perfil');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const dataCadastroSpan = document.getElementById('data-cadastro');

    // 1. Carregar dados do usuário
    try {
        const response = await fetch('/api/auth/perfil', { credentials: 'include' });
        
        if (response.status === 401) {
            alert("Sessão expirada. Faça login novamente.");
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();
        
        // Preenche os campos
        nomeInput.value = data.nome;
        emailInput.value = data.email;
        
        // Formata a data de cadastro
        if (data.created_at) {
            const date = new Date(data.created_at);
            dataCadastroSpan.textContent = date.toLocaleDateString('pt-BR');
        }

    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        alert("Erro ao carregar seus dados.");
    }

    // 2. Enviar atualizações
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = nomeInput.value;
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarNovaSenha').value;

        // Validação simples de senha
        if (novaSenha && novaSenha !== confirmarSenha) {
            alert("A nova senha e a confirmação não coincidem.");
            return;
        }

        try {
            const response = await fetch('/api/auth/perfil', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ nome, novaSenha })
            });

            const result = await response.json();
            alert(result.message);

            if (response.ok) {
                // Limpa os campos de senha após sucesso
                document.getElementById('novaSenha').value = '';
                document.getElementById('confirmarNovaSenha').value = '';
            }

        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil. Tente novamente.");
        }
    });
});