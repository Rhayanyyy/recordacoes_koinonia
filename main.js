import { db, storage } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

document.addEventListener("DOMContentLoaded", () => {
  // Elementos DOM
  const form = document.getElementById("postForm");
  const nomeInput = document.getElementById("nome");
  const msgInput = document.getElementById("mensagem");
  const midiaInput = document.getElementById("mídia");
  const postsContainer = document.getElementById("postsContainer");
  const filtroNome = document.getElementById("filtroNome");

  const abrirFormulario = document.getElementById("abrirFormulario");
  const secaoFormulario = document.getElementById("formulario");
  const secaoMural = document.getElementById("mural");
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const voltarBtn = document.getElementById("voltar");

  // Controle para mostrar/ocultar formulário e mural
  abrirFormulario.addEventListener("click", () => {
    secaoMural.classList.add("escondido");
    secaoFormulario.classList.remove("escondido");
    mensagemSucesso.classList.add("escondido");
  });

  voltarBtn.addEventListener("click", () => {
    secaoFormulario.classList.add("escondido");
    secaoMural.classList.remove("escondido");
  });

  // Funções para curtidas locais
  function getCurtidasLocais() {
    return JSON.parse(localStorage.getItem("curtidas") || "[]");
  }
  function salvarCurtidaLocal(postId) {
    const curtidas = getCurtidasLocais();
    curtidas.push(postId);
    localStorage.setItem("curtidas", JSON.stringify(curtidas));
  }

  // Função para mostrar posts na tela
  function renderPosts(docs) {
    postsContainer.innerHTML = "";

    if (docs.length === 0) {
      postsContainer.innerHTML = "<p>Nenhuma recordação postada ainda.</p>";
      return;
    }

    docs.forEach(({ id, data }) => {
      const dados = data;

      const postEl = document.createElement("div");
      postEl.classList.add("post");

      // Conteúdo do post
      const dataFormatada = dados.data?.toDate
        ? dados.data.toDate().toLocaleString("pt-BR")
        : "Sem data";

      // Curtidas
      const numCurtidas = dados.curtidas || 0;

      postEl.innerHTML = `
        <strong>${dados.nome}</strong>
        <p>${dados.mensagem}</p>
        ${dados.midiaURL ? 
          (dados.midiaURL.endsWith(".mp4") || dados.midiaURL.endsWith(".mov")
            ? `<video controls src="${dados.midiaURL}" style="max-width: 100%; margin-top: 10px; border-radius: 8px;"></video>`
            : `<img src="${dados.midiaURL}" alt="Mídia postada" style="max-width: 100%; margin-top: 10px; border-radius: 8px;" />`
          ) : ""
        }
        <p style="font-size: 0.8rem; color: #d4b483; margin-top: 8px;">${dataFormatada}</p>
        <div class="curtir" data-id="${id}" title="Curtir essa postagem">
          ❤️ <span class="contador">${numCurtidas}</span>
        </div>
      `;

      postsContainer.appendChild(postEl);
    });
  }

  // Query e snapshot para carregar posts em tempo real
  const q = query(collection(db, "posts"), orderBy("data", "desc"));

  let todosPosts = [];

  onSnapshot(q, (snapshot) => {
    todosPosts = snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    renderPosts(todosPosts);
  });

  // Filtro por nome
  filtroNome.addEventListener("input", () => {
    const filtro = filtroNome.value.trim().toLowerCase();
    const filtrados = todosPosts.filter(({ data }) =>
      data.nome.toLowerCase().includes(filtro)
    );
    renderPosts(filtrados);
  });

  // Envio do formulário
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const mensagem = msgInput.value.trim();
    const arquivo = midiaInput.files[0];

    if (!nome || !mensagem) {
      alert("Por favor, preencha o nome e a mensagem!");
      return;
    }

    let midiaURL = null;

    try {
      if (arquivo) {
        const caminho = `midias/${Date.now()}_${arquivo.name}`;
        const arquivoRef = ref(storage, caminho);

        await uploadBytes(arquivoRef, arquivo);
        midiaURL = await getDownloadURL(arquivoRef);
      }

      await addDoc(collection(db, "posts"), {
        nome,
        mensagem,
        midiaURL,
        curtidas: 0,
        data: serverTimestamp()
      });

      form.reset();
      mensagemSucesso.classList.remove("escondido");
      secaoFormulario.classList.add("escondido");
      secaoMural.classList.remove("escondido");

    } catch (erro) {
      console.error("Erro ao postar:", erro);
      alert("Algo deu errado ao enviar. Veja o console para detalhes.");
    }
  });

  // Curtir post com controle localStorage
  postsContainer.addEventListener("click", async (e) => {
    const curtirEl = e.target.closest(".curtir");
    if (!curtirEl) return;

    const postId = curtirEl.dataset.id;
    const curtidasLocais = getCurtidasLocais();

    if (curtidasLocais.includes(postId)) {
      alert("Você já curtiu essa publicação.");
      return;
    }

    try {
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        curtidas: increment(1)
      });
      salvarCurtidaLocal(postId);
    } catch (erro) {
      console.error("Erro ao curtir:", erro);
    }
  });
});
