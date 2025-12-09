document.addEventListener("DOMContentLoaded", async () => {
  // 1. Pegar o ID da URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    alert("Produto não especificado.");
    window.location.href = "index.html";
    return;
  }

  try {
    // 2. Chamar a API do Back-end
    const response = await fetch(`/api/infosuplementos/detalhes/${id}`);

    if (!response.ok) throw new Error("Erro ao buscar produto");

    const product = await response.json();

    // 3. Esconder 'Carregando' e Mostrar o Container
    document.getElementById("loading-msg").classList.add("hidden");
    document
      .getElementById("product-detail-container")
      .classList.remove("hidden");

    // 4. Preencher os Dados

    // Imagem (usa o placeholder se não tiver imagem no banco)
    // Note que sua tabela 'midias' guarda o caminho, ex: 'resources/whey_generico.jpg'
    const imgUrl = product.imagem_url || "resources/logo.png";
    document.getElementById("detail-img").src = imgUrl;

    document.getElementById("detail-name").textContent = product.nome;
    document.getElementById("detail-brand").textContent = product.marca;
    document.getElementById("detail-type").textContent =
      product.tipo_suplemento;
    document.getElementById("detail-org").textContent =
      product.orgao_laudo || "Não informado";
    document.getElementById("detail-text").textContent =
      product.detalhes_laudo || "Nenhum detalhe adicional informado.";

    // Formatar Data (se existir)
    if (product.data_laudo) {
      // Cria a data e formata para dia/mês/ano
      const dataObj = new Date(product.data_laudo);
      document.getElementById("detail-date").textContent =
        dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    } else {
      document.getElementById("detail-date").textContent = "Data não informada";
    }

    // Estilizar o Status (Verde para Aprovado, Vermelho para Reprovado)
    const statusEl = document.getElementById("detail-status");
    statusEl.textContent = product.status_aprovacao;

    if (product.status_aprovacao === "APROVADO") {
      statusEl.className = "status-badge status-aprovado";
      statusEl.style.backgroundColor = "#d4edda"; // Fundo verde claro
      statusEl.style.color = "#155724";
    } else {
      statusEl.className = "status-badge status-reprovado";
      statusEl.style.backgroundColor = "#f8d7da"; // Fundo vermelho claro
      statusEl.style.color = "#721c24";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("loading-msg").textContent =
      "Erro ao carregar informações do produto. Tente novamente.";
  }
  // --- LÓGICA DE AVALIAÇÕES ---

    // 1. Verifica se usuário está logado para mostrar o formulário
    const formContainer = document.getElementById('review-form-container');
    const loginWarning = document.getElementById('login-warning');

    try {
        const authResp = await fetch('/api/auth/status', { credentials: 'include' });
        const authData = await authResp.json();
        
        if (authData.loggedIn) {
            formContainer.classList.remove('hidden');
        } else {
            loginWarning.classList.remove('hidden');
        }
    } catch (e) {
        loginWarning.classList.remove('hidden');
    }

    // 2. Carregar Avaliações Existentes ao abrir a página
    carregarAvaliacoes(id);

    // 3. Enviar Nova Avaliação
    const formAvaliacao = document.getElementById('form-avaliacao');
    if (formAvaliacao) {
        formAvaliacao.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const comentario = document.getElementById('comentario-texto').value;
            
            // Pega as notas selecionadas
            const saborInput = document.querySelector('input[name="nota_sabor"]:checked');
            const custoInput = document.querySelector('input[name="nota_custo"]:checked');
            
            if (!saborInput || !custoInput) {
                alert("Por favor, dê uma nota tanto para o Sabor quanto para o Custo-Benefício.");
                return;
            }

            try {
                const response = await fetch('/api/suplementos/avaliacoes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        id_suplemento: id,
                        nota_sabor: saborInput.value,
                        nota_custo: custoInput.value,
                        comentario: comentario
                    })
                });

                const result = await response.json();
                alert(result.message);

                if (response.ok) {
                    formAvaliacao.reset(); // Limpa o form
                    carregarAvaliacoes(id); // Recarrega a lista para mostrar o novo comentário
                }
            } catch (error) {
                console.error("Erro ao enviar avaliação:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});


// ... Fim do DOMContentLoaded ...

// --- FUNÇÃO AUXILIAR PARA CARREGAR A LISTA ---
async function carregarAvaliacoes(idProduto) {
    const listContainer = document.getElementById('reviews-list');
    
    try {
        const response = await fetch(`/api/suplementos/${idProduto}/avaliacoes`);
        const avaliacoes = await response.json();

        if (avaliacoes.length === 0) {
            listContainer.innerHTML = '<p style="color: #777; font-style: italic; text-align:center; padding: 20px;">Nenhuma avaliação ainda. Seja o primeiro!</p>';
            return;
        }

        listContainer.innerHTML = '';
        
        avaliacoes.forEach(av => {
            // Função rápida para criar string de estrelas (ex: ★★★★☆)
            const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
            const dataFormatada = new Date(av.data_avaliacao).toLocaleDateString('pt-BR');

            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <div class="review-header">
                    <span class="review-user"><i class="fa-solid fa-user"></i> ${av.nome_usuario}</span>
                    <span class="review-date">${dataFormatada}</span>
                </div>
                
                <div class="review-scores">
                    <div class="score-item">Sabor: <strong>${stars(av.nota_sabor)}</strong></div>
                    <div class="score-item">Custo-Benefício: <strong>${stars(av.nota_custo)}</strong></div>
                </div>

                <div class="review-body">
                    ${av.comentario}
                </div>
            `;
            listContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Erro ao carregar lista:", error);
        listContainer.innerHTML = '<p>Erro ao carregar avaliações.</p>';
    }
}

