//  Capturando o formulário de cadastro
const formCadastro = document.getElementById("form-cadastro");

//  Adicionando um evento para quando o formulário for enviado
formCadastro.addEventListener("submit", async function (event) {
  //  Previne que a página recarregue automaticamente
  event.preventDefault();

  //  Capturando valores dos campos de cadastro
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  //  Requisição para o backend
  try {
    const response = await fetch("/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    //  Conversão para json
    const data = await response.json();
    console.log("Resposta do servidor: ", data);
    //  Feedback no navegador
    alert(data.message);
    //  Feedback de erro
  } catch (error) {
    console.error("Erro ao cadastrar: ", error);
  }
});
