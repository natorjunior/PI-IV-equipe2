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
  const confirmarSenha = document.getElementById("confirmar-senha").value;

  //  verificação se as senhas são válidas
  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem. Por favor, tente novamente.");
    return;
  }

  //  Requisição para o backend (só acontece se as senhas coincidirem)
  try {
    // "http://backend:3000/api/auth/cadastro"
    const response = await fetch("/api/auth/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      //  convertendo o objeto java script em uma string no formato json;
      body: JSON.stringify({ nome, email, senha }),
    });

    //  armazenando a resposta do backend na variável data
    const data = await response.json();
    //  exibindo a respodta do backend no terminal
    console.log("Resposta do servidor: ", data);
    //  exibindo mensagem no navegador
    alert(data.message);

    //  caso de cadastro bem-sucedido
    if (response.ok) {
      //  redirencionando para a tela de login
      window.location.href = "/login.html";
    }

    //  tratando erro na requisição
  } catch (error) {
    console.error("Erro ao cadastrar: ", error);
    //  exibindo mensagem de erro no navegador
    alert("Erro ao cadastrar usuário");
  }
});
