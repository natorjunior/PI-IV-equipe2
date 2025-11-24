document.addEventListener("DOMContentLoaded", async () => {
  const tableBody = document.getElementById("lista-produtos");
  const modal = document.getElementById("modal-produto");
  const form = document.getElementById("form-produto");

  // 1. Verificação de Segurança (Auth Guard)
  try {
    const response = await fetch("/api/auth/status", {
      credentials: "include",
    });
    const data = await response.json();

    // Se não estiver logado OU não for admin (tipo !== 'ADMINISTRADOR')
    if (!data.loggedIn || data.user.tipo !== "ADMINISTRADOR") {
      alert("Acesso restrito a administradores.");
      window.location.href = "index.html";
      return;
    }
  } catch (error) {
    window.location.href = "index.html";
    return;
  }

  // 2. Carregar Produtos
  carregarProdutos();

  async function carregarProdutos() {
    try {
      // Usa a rota de busca sem parâmetros para pegar todos
      const response = await fetch("/api/infosuplementos/search");
      const produtos = await response.json();

      tableBody.innerHTML = "";

      produtos.forEach((prod) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${prod.id_suplemento}</td>
                    <td>${prod.nome}</td>
                    <td>${prod.marca}</td>
                    <td>${prod.tipo_suplemento}</td>
                    <td><span class="status-${prod.status_aprovacao.toLowerCase()}">${
          prod.status_aprovacao
        }</span></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editarProduto(${
                          prod.id_suplemento
                        })">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="deletarProduto(${
                          prod.id_suplemento
                        })">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
        tableBody.appendChild(tr);
      });
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  }

  // 3. Abrir/Fechar Modal
  document.getElementById("btn-novo-produto").addEventListener("click", () => {
    form.reset();
    document.getElementById("prod-id").value = "";
    document.getElementById("modal-titulo").textContent = "Novo Produto";
    modal.classList.remove("hidden");
  });

  document.getElementById("btn-cancelar").addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  // 4. Salvar Produto (Criar ou Editar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("prod-id").value;
    const produto = {
      nome: document.getElementById("prod-nome").value,
      marca: document.getElementById("prod-marca").value,
      // CORREÇÃO AQUI:
      tipo_suplemento: document.getElementById('prod-tipo').value, 
      // CORREÇÃO AQUI:
      status_aprovacao: document.getElementById('prod-status').value,
      imagem_url: document.getElementById("prod-img").value,
      orgao_laudo: document.getElementById("prod-orgao").value,
      data_laudo: document.getElementById("prod-data").value,
      detalhes_laudo: document.getElementById("prod-detalhes").value,
    };

    const url = id ? `/api/admin/produtos/${id}` : "/api/admin/produtos";
    const method = id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(produto),
      });

      const resData = await response.json();

      if (response.ok) {
        alert(resData.message);
        modal.classList.add("hidden");
        carregarProdutos();
      } else {
        alert("Erro: " + resData.message);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar produto.");
    }
  });
});

// Funções Globais para os botões da tabela
async function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  try {
    const response = await fetch(`/api/admin/produtos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      alert("Produto excluído.");
      location.reload();
    } else {
      alert("Erro ao excluir.");
    }
  } catch (error) {
    console.error(error);
  }
}

async function editarProduto(id) {
  // Busca os dados do produto para preencher o form
  try {
    const response = await fetch(`/api/infosuplementos/${id}`);
    const prod = await response.json();

    document.getElementById("prod-id").value = prod.id_suplemento;
    document.getElementById("prod-nome").value = prod.nome;
    document.getElementById("prod-marca").value = prod.marca;
    document.getElementById("prod-tipo").value = prod.tipo_suplemento;
    document.getElementById("prod-status").value = prod.status_aprovacao;
    document.getElementById("prod-img").value = prod.imagem_url || "";
    document.getElementById("prod-orgao").value = prod.orgao_laudo || "";
    document.getElementById("prod-detalhes").value = prod.detalhes_laudo || "";

    if (prod.data_laudo) {
      const date = new Date(prod.data_laudo);
      document.getElementById("prod-data").value = date
        .toISOString()
        .split("T")[0];
    }

    document.getElementById("modal-titulo").textContent = "Editar Produto";
    document.getElementById("modal-produto").classList.remove("hidden");
  } catch (error) {
    console.error("Erro ao carregar dados para edição:", error);
  }
}
