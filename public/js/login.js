//  Capturando o formulário de login
const formLogin = document.getElementById("form-login");

//  Adicionando um evento para quando o formulário for enviado
formLogin.addEventListener("submit", async function (event) {
  //  Previne que a página recarregue automaticamente
  event.preventDefault();

  //  Capturando os valores dos campos email e senha
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  //  Requisição para o backend
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    //  Conversão para json
    const data = await response.json();
    console.log("Resposta do servidor: ", data);

    if (response.ok) {
      window.location.href = "/index.html";
    } else {
      alert(data.message);
    }
    //  Feedback de erro
  } catch (error) {
    console.error("Erro ao realizar login: ", error);
    alert("Erro ao conectar ao servidor");
  }
});
