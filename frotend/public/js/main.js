document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELEÇÃO DE ELEMENTOS ---
  const guestMenu = document.getElementById("guest-menu");
  const userMenu = document.getElementById("user-menu");
  const logoutButton = document.getElementById("logout-button");
  const favoriteIcons = document.querySelectorAll(".favorite-icon");
  const headerFavoritesIcon = document.getElementById("header-favorites-icon"); // Novo elemento selecionado

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // --- 2. LÓGICA DE EXIBIÇÃO DO CABEÇALHO ---
  if (isLoggedIn === "true") {
    guestMenu.classList.add("hidden");
    userMenu.classList.remove("hidden");
  } else {
    guestMenu.classList.remove("hidden");
    userMenu.classList.add("hidden");
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }

  // --- 3. LÓGICA PARA FUNCIONALIDADES QUE PRECISAM DE LOGIN ---

  // Função que verifica o login e exibe alertas
  const checkLoginAndAlert = (event) => {
    event.preventDefault();
    if (isLoggedIn === "true") {
      alert("Funcionalidade para usuários logados! (Em desenvolvimento)");
    } else {
      alert("É necessário fazer o login para usar esta funcionalidade.");
    }
  };

  // Adiciona o evento de verificação ao ícone de favoritos do CABEÇALHO
  if (headerFavoritesIcon) {
    headerFavoritesIcon.addEventListener("click", checkLoginAndAlert);
  }

  // Adiciona o evento de verificação aos ícones de favorito dos CARDS
  favoriteIcons.forEach((icon) => {
    icon.addEventListener("click", checkLoginAndAlert);
  });
});
