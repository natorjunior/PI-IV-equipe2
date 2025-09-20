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
    //  fetch() é usada para fazer uma requisição (envia informações) a uma rota no servidor;
    //  Quando o fech é executado ele não responde imediatamente, mas sim retorna uma Promise (promessa de que a resposta chegará);
    //  armazena a resposta da requisição feita ao backend na variavel response
    //  "http://backend:3000/api/auth/login"
    const response = await fetch("/api/auth/login", {
      //  Tipo da requisição: POST (envio de dados)
      method: "POST",
      //  Cabeçalho com as informações (em formato JSON)
      headers: { "Content-Type": "application/json" },
      //  garante que cookies sejam enviados
      credentials: "include",
      //  Converte o objeto js {email, senha} em JSON ({"email": "teste@g.com", "senha": "pass"}) antes de enviar
      body: JSON.stringify({ email, senha }),
    });

    //  armazenando a resposta do backend na variável data
    const data = await response.json();
    //  exibindo a respodta do backend no terminal
    console.log("Resposta do servidor: ", data);

    //  Se login bem-sucedido, dereciona para a página home
    if (response.ok) {
      // Salva o estado de logadono localStorage
      localStorage.setItem("isLoggedIn", "true");
      //  redirencionando para a tela home
      window.location.href = "/index.html";
    } else {
      //  exibindo mensagem de erro no navegador
      alert(data.message);
    }
    //  tratando erro na requisição
  } catch (error) {
    console.error("Erro ao realizar login: ", error);
    //  exibindo mensagem de erro no navegador
    alert("Erro ao conectar ao servidor");
  }
});
