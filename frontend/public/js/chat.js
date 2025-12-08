document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('chatbot-container');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatWindow = document.getElementById('chatbot-window');
    const sendBtn = document.getElementById('chat-send');
    const inputField = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const callToAction = document.getElementById('chatbot-call-to-action');

   // Função para abrir o chat
    function openChat() {
        chatWindow.classList.remove('hidden');
        container.classList.add('chat-open'); // Adiciona classe para esconder o balão via CSS
    }

    // Função para fechar
    function closeChat() {
        chatWindow.classList.add('hidden');
        container.classList.remove('chat-open'); // Mostra o balão de volta
    }

    // Eventos
    toggleBtn.addEventListener('click', () => {
        if (chatWindow.classList.contains('hidden')) {
            openChat();
        } else {
            closeChat();
        }
    });

    closeBtn.addEventListener('click', closeChat);

    // Se clicar no balão de texto, também abre o chat
    if(callToAction) {
        callToAction.addEventListener('click', openChat);
    }

    // Adicionar mensagem na tela
    const addMessage = (text, sender) => {
        const div = document.createElement('div');
        div.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
        div.textContent = text;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Rola para o final
    };

    // Enviar mensagem para a API
    const sendMessage = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // 1. Mostra mensagem do usuário
        addMessage(text, 'user');
        inputField.value = '';
        inputField.disabled = true; // Bloqueia input enquanto pensa

        // 2. Mostra "Digitando..." temporário
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot-message');
        loadingDiv.textContent = 'Digitando...';
        loadingDiv.id = 'loading-msg';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // 3. Chama o Back-end
            const response = await fetch('/api/chat/falar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensagem: text })
            });

            const data = await response.json();
            
            // 4. Remove o "Digitando..." e mostra a resposta real
            loadingDiv.remove();
            addMessage(data.resposta, 'bot');

        } catch (error) {
            loadingDiv.remove();
            addMessage("Erro ao conectar com a IA. Tente novamente.", 'bot');
            console.error(error);
        } finally {
            inputField.disabled = false;
            inputField.focus();
        }
    };

    // Eventos de envio
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }
});