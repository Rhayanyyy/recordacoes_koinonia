import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDx7T6bMgtNFuiI3ZNngYN-a7fhslXeR9k",
  authDomain: "recordacoes-koinoniaa.firebaseapp.com",
  projectId: "recordacoes-koinoniaa",
  storageBucket: "recordacoes-koinoniaa.appspot.com", // ✅ Aqui está o conserto!
  messagingSenderId: "18159549925",
  appId: "1:18159549925:web:f7d9f28e73b65fc76fc30c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const btnAbrirPublicacao = document.getElementById("btnAbrirPublicacao");
const modalPublicar = document.getElementById("modalPublicar");
const formPublicacao = document.getElementById("formPublicacao");
const msgSucesso = document.getElementById("msgSucesso");

// Abre modal de publicação
btnAbrirPublicacao.addEventListener("click", () => {
  modalPublicar.classList.remove("escondido");
  msgSucesso.classList.add("escondido");
  formPublicacao.style.display = "block";
});


// Fecha modal publicar
btnFecharPublicar.addEventListener("click", () => {
  modalPublicar.classList.add("escondido");
  formPublicacao.reset();
});

// Fecha modal post
btnFecharModal.addEventListener("click", () => {
  modalPost.classList.add("escondido");
  const video = conteudoPost.querySelector("video");
  if (video) video.pause();
});

// Formulário enviar publicação
formPublicacao.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const comentario = document.getElementById("comentario").value.trim();
  const arquivoInput = document.getElementById("arquivo");
  const arquivo = arquivoInput.files[0];

  if (!nome || !comentario) {
    alert("Preencha nome e comentário!");
    return;
  }

  try {
    let tipo = null;
    let mediaURL = null;

    if (arquivo) {
      tipo = arquivo.type.startsWith("image/") ? "imagem" :
             arquivo.type.startsWith("video/") ? "video" : null;

      if (!tipo) {
        alert("Arquivo inválido! Use imagem ou vídeo.");
        return;
      }

      // Upload para Firebase Storage
      const storageRef = ref(storage, `midias/${Date.now()}_${arquivo.name}`);
      await uploadBytes(storageRef, arquivo);
      mediaURL = await getDownloadURL(storageRef);
    }

    // Salvar post no Firestore
    await addDoc(collection(db, "posts"), {
      nome,
      comentario,
      tipo,
      media: mediaURL,
      data: serverTimestamp()
    });

    // Mostra mensagem sucesso e esconde formulário
    formPublicacao.style.display = "none";
    msgSucesso.classList.remove("escondido");
    formPublicacao.reset();

  } catch (error) {
    alert("Erro ao enviar a publicação: " + error.message);
  }
});


// Adiciona post no array e atualiza mural
function adicionarPost(nome, comentario, tipo, media) {
  posts.unshift({ nome, comentario, tipo, media });
  atualizarMural();

  formPublicacao.style.display = "none";
  msgSucesso.classList.remove("escondido");
  formPublicacao.reset();
}

// Atualiza mural com os posts
function atualizarMural() {
  postsContainer.innerHTML = "";
  posts.forEach((post, index) => {
    const card = criarCardPost(post, index);
    postsContainer.appendChild(card);
  });
}

// Cria card post
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

  card.addEventListener("click", () => abrirModalPost(index));

  return card;
}

// Abre modal do post
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

// Botão voltar ao mural após sucesso
btnVoltarMural.addEventListener("click", () => {
  modalPublicar.classList.add("escondido");
  formPublicacao.style.display = "block";
  msgSucesso.classList.add("escondido");
});

import { query, orderBy, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const q = query(collection(db, "posts"), orderBy("data", "desc"));
onSnapshot(q, (snapshot) => {
  posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  atualizarMural();
});
