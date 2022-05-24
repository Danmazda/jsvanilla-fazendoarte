const baseUrl = "http://localhost:3000/aromatizador";

const produtosContainer = document.querySelector(".produtos__container");
async function pegarTodosOsAromatizadores() {
  const response = await fetch(`${baseUrl}/all`);
  const aromatizadores = await response.json();
  return aromatizadores;
}
async function pegarAromatizadorPorId(id) {
  const response = await fetch(`${baseUrl}/id/${id}`);
  const aromatizador = await response.json();
  return aromatizador;
}

async function imprimirTodosOsProdutos() {
  const aromatizadores = await pegarTodosOsAromatizadores();
  aromatizadores.forEach((aro) => {
    produtosContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="produtos__container__card" id="${aro._id}">
    <h3>${aro.fragrance}</h3>
    <img src="${aro.image}" alt=" ${aro.fragrance}">
    <p>${aro.description}</p>
    <p>R$${aro.price.toFixed(2)}</p>
  </div>`
    );
  });
}

imprimirTodosOsProdutos();
