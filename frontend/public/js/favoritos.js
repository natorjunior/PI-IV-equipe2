document.addEventListener("DOMContentLoaded", async () => {
  try {
    const statusResponse = await fetch("/api/auth/status", {
      credentials: "include",
    });
    const statusData = await statusResponse.json();
    if (!statusData.loggedIn) {
      alert("Você precisa estar logado para ver seus favoritos.");
      window.location.href = "login.html"; // Redireciona se não estiver logado
      return;
    }
  } catch (error) {
    console.error("Erro de autenticação:", error);
    window.location.href = "login.html";
    return;
  }

  // Se o usuário está logado, busca e exibe os favoritos
  const favoritesGrid = document.getElementById("favorites-grid");
  const emptyMessage = document.getElementById("empty-favorites-message");

  try {
    const response = await fetch("/api/infosuplementos/favoritos", {
      credentials: "include",
    });
    const favorites = await response.json();

    if (favorites.length === 0) {
      emptyMessage.classList.remove("hidden");
    } else {
      favoritesGrid.innerHTML = "";
      favorites.forEach((product) => {
        const card = document.createElement("div");
        card.className = "supplement-card";
        card.innerHTML = `
                    <h3>${product.nome}</h3>
                    <p>Marca: ${product.marca}</p>
                    <p class="status-${product.status_aprovacao.toLowerCase()}">Status: ${
          product.status_aprovacao
        }</p>
                    <div class="card-footer">
                        <button class="remove-favorite-btn" data-id="${
                          product.id_suplemento
                        }">Remover</button>
                    </div>
                `;
        favoritesGrid.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
  }
});

// Adiciona o listener para o botão "Remover" usando delegação de eventos
document
  .getElementById("favorites-grid")
  .addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-favorite-btn")) {
      const suplementoId = event.target.getAttribute("data-id");

      if (!confirm("Tem certeza que deseja remover este item dos favoritos?")) {
        return;
      }

      try {
        const response = await fetch(
          `/api/infosuplementos/favoritos/${suplementoId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
          window.location.reload(); // Recarrega a página para atualizar a lista
        }
      } catch (error) {
        console.error("Erro ao remover favorito:", error);
        alert("Não foi possível remover o favorito.");
      }
    }
  });
