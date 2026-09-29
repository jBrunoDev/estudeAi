const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();

  if (!message) {
    return;
  }

  // Mostra mensagem do usuário
  adicionarMensagem("Você", message);

  // Limpa o input
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao enviar mensagem.");
    }

    // Mostra resposta da IA
    adicionarMensagem("Estude AI", data.response);

  } catch (error) {
    console.error(error);

    adicionarMensagem(
      "Sistema",
      "Não foi possível obter uma resposta."
    );
  }
});

function adicionarMensagem(autor, texto) {
  const container = document.createElement("div");

  container.classList.add("message");

  const nome = document.createElement("strong");
  nome.textContent = autor;

  const conteudo = document.createElement("p");
  conteudo.textContent = texto;

  container.appendChild(nome);
  container.appendChild(conteudo);

  messages.appendChild(container);

  messages.scrollTop = messages.scrollHeight;
}