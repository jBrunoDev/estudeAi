require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
const PORT = 3000;

// -----------------------------
// Configuração da Groq
// -----------------------------

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// -----------------------------
// Carrega o agent.md
// -----------------------------

const caminhoAgente = path.join(__dirname, "agent.md");
const agente = fs.readFileSync(caminhoAgente, "utf-8");

// -----------------------------
// Histórico da conversa
// -----------------------------

const messages = [
  {
    role: "system",
    content: agente,
  },
];

// -----------------------------
// Middlewares
// -----------------------------

// Permite receber JSON
app.use(express.json());

// Disponibiliza os arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// -----------------------------
// Endpoint do chat
// -----------------------------

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  console.log("\nMensagem recebida:", message);

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      error: "Mensagem inválida.",
    });
  }

  const mensagemUsuario = message.trim();

  messages.push({
    role: "user",
    content: mensagemUsuario,
  });

  try {
    console.log("Enviando para Groq...");

    const resposta = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: messages,
    });

    console.log("Resposta recebida da Groq.");

    const respostaIA = resposta.choices[0].message.content;

    console.log("Resposta:", respostaIA);

    messages.push({
      role: "assistant",
      content: respostaIA,
    });

    res.json({
      response: respostaIA,
    });

  } catch (erro) {
    messages.pop();

    console.error("ERRO GROQ:");
    console.error(erro);

    res.status(500).json({
      error: "Não foi possível obter uma resposta da IA.",
    });
  }
});

// -----------------------------
// Inicia servidor
// -----------------------------

app.listen(PORT, () => {
  console.log(`Estude AI rodando em http://localhost:${PORT}`);
});