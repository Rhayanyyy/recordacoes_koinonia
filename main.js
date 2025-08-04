const btnAbrirPublicacao = document.getElementById("btnAbrirPublicacao");
const modalPublicar = document.getElementById("modalPublicar");
const modalPost = document.getElementById("modalPost");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnFecharPublicar = document.getElementById("btnFecharPublicar");
const postsContainer = document.getElementById("postsContainer");
const formPublicacao = document.getElementById("formPublicacao");
const conteudoPost = document.getElementById("conteudoPost");
const msgSucesso = document.getElementById("msgSucesso");
const btnVoltarMural = document.getElementById("btnVoltarMural");

let posts = [];

// Função pra criar card e colocar no mural
function criarCardPost(post, index) {
  const card = document.createElement("div");
  card.classList.add("post-card");
  card.dataset.index = index;

  let mediaHTML = "";
  if (post.tipo === "imagem") {
    mediaHTML = `<img src="${post.media}" alt="Imagem do post">`;
  } else if (post.tipo === "video") {
    mediaHTML = `<video src="${post.media}" controls></video>`;
  }

  card.innerHTML = `
    <strong>${post.nome}</strong>
    <p>${post.comentario}</p>
    ${mediaHTML}
  `;

  // Evento abrir modal do post
  card.addEventListener("click", () => abrirModalPost(index));

  return card;
}

// Mostrar modal do post clicado
function abrirModalPost(index) {
  const post = posts[index];
  if (!post) return;

  let mediaHTML = "";
  if (post.tipo === "imagem") {
    mediaHTML = `<img src="${post.media}" alt="Imagem do post" style="max-width:100%; max-height:300px; border-radius:8px;">`;
  } else if (post.tipo === "video") {
    mediaHTML = `<video src="${post.media}" controls autoplay style="max-width:100%; max-height:300px; border-radius:8px;"></video>`;
  }

  conteudoPost.innerHTML = `
    <strong>${post.nome}</strong>
    <p>${post.comentario}</p>
    ${mediaHTML}
  `;

  modalPost.classList.remove("escondido");
}

// Fecha modal do post
btnFecharModal.addEventListener("click", () => {
  modalPost.classList.add("escondido");
  // Para vídeos que ficaram tocando
  const video = conteudoPost.querySelector("video");
  if (video) video.pause();
});

// Abre modal de publicação
btnAbrirPublicacao.addEventListener("click", () => {
  modalPublicar.classList.remove("escondido");
  msgSucesso.classList.add("escondido");
  formPublicacao.style.display = "block";
});

// Fecha modal de publicação
btnFecharPublicar.addEventListener("click", () => {
  modalPublicar.classList.add("escondido");
  formPublicacao.reset();
});

// Envia o formulário da publicação
formPublicacao.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const arquivoInput = document.getElementById("arquivo");
  const arquivo = arquivoInput.files[0];

  if (!nome || !comentario) {
    alert("Preencha nome e comentário!");
    return;
  }

  if (arquivo) {
    const tipo = arquivo.type.startsWith("image/") ? "imagem" :
                 arquivo.type.startsWith("video/") ? "video" : null;

    if (!tipo) {
      alert("Arquivo inválido! Use imagem ou vídeo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
      adicionarPost(nome, comentario, tipo, event.target.result);
    };
    reader.readAsDataURL(arquivo);

  } else {
    // Sem mídia
    adicionarPost(nome, comentario, null, null);
  }
});

// Função que adiciona post e atualiza mural
function adicionarPost(nome, comentario, tipo, media) {
  posts.unshift({ nome, comentario, tipo, media });
  atualizarMural();

  // Mostra mensagem sucesso e esconde formulário
  formPublicacao.style.display = "none";
  msgSucesso.classList.remove("escondido");
  formPublicacao.reset();
}

// Atualiza o mural mostrando os cards
function atualizarMural() {
  postsContainer.innerHTML = "";
  posts.forEach((post, index) => {
    const card = criarCardPost(post, index);
    postsContainer.appendChild(card);
  });
}

// Voltar ao mural após sucesso
btnVoltarMural.addEventListener("click", () => {
  modalPublicar.classList.add("escondido");
  formPublicacao.style.display = "block";
  msgSucesso.classList.add("escondido");
});
