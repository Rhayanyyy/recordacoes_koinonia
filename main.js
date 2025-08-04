// main.js
import { db, storage, auth, provider } from "./firebase.js";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("postForm");
const nomeInput = document.getElementById("nome");
const msgInput = document.getElementById("mensagem");
const midiaInput = document.getElementById("midia");
const postsContainer = document.getElementById("postsContainer");
const btnLoginGoogle = document.getElementById("btnLoginGoogle");
const btnLogout = document.getElementById("btnLogout");
const userStatus = document.getElementById("userStatus");

// Controle estado do usuário
onAuthStateChanged(auth, (user) => {
  if (user) {
    userStatus.textContent = `Logado como: ${user.displayName}`;
    nomeInput.value = user.displayName;
    nomeInput.disabled = true;
    btnLoginGoogle.style.display = "none";
    btnLogout.style.display = "inline-block";
  } else {
    userStatus.textContent = "Não está logado";
    nomeInput.value = "";
    nomeInput.disabled = false;
    btnLoginGoogle.style.display = "inline-block";
    btnLogout.style.display = "none";
  }
});

// Login com Google
btnLoginGoogle.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      alert(`Bem-vindo(a) ${result.user.displayName}!`);
    })
    .catch((error) => {
      console.error("Erro no login Google:", error);
      alert("Erro ao tentar logar com Google.");
    });
});

// Logout
btnLogout.addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Você saiu da conta.");
  });
});

// Evento de envio de postagem
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
      data: serverTimestamp(),
    });

    alert("Postagem enviada com sucesso!");
    form.reset();

  } catch (erro) {
    console.error("Erro ao postar:", erro);
    alert("Algo deu errado ao enviar. Veja o console para detalhes.");
  }
});

// Exibe posts
const q = query(collection(db, "posts"), orderBy("data", "desc"));

onSnapshot(q, (snapshot) => {
  postsContainer.innerHTML = "";

  if (snapshot.empty) {
    postsContainer.innerHTML = "<p>Nenhuma recordação postada ainda.</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const dados = doc.data();

    const postEl = document.createElement("div");
    postEl.classList.add("post");

    postEl.innerHTML = `
      <strong>${dados.nome}</strong>
      <p>${dados.mensagem}</p>
      ${dados.midiaURL ? `<img src="${dados.midiaURL}" alt="Mídia postada" />` : ""}
      <hr />
    `;

    postsContainer.appendChild(postEl);
  });
});
