const abrirFormulario = document.getElementById("abrirFormulario");
const secaoFormulario = document.getElementById("formulario");
const secaoMural = document.getElementById("mural");
const mensagemSucesso = document.getElementById("mensagemSucesso");
const voltarBtn = document.getElementById("voltar");

abrirFormulario.addEventListener("click", () => {
  secaoMural.classList.add("escondido");
  secaoFormulario.classList.remove("escondido");
  mensagemSucesso.classList.add("escondido");
});

voltarBtn.addEventListener("click", () => {
  secaoFormulario.classList.add("escondido");
  secaoMural.classList.remove("escondido");
});

// Mostrar mensagem de sucesso após publicar
form.addEventListener("submit", async (e) => {
  // ... seu código de envio ...

  alert("Postagem enviada com sucesso!"); // substitua por:
  mensagemSucesso.classList.remove("escondido");
  form.reset();
});
