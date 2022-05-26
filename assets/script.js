const baseUrl = "http://localhost:3000/aromatizador";

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
  const produtosContainer = document.querySelector(".produtos__container");
  produtosContainer.innerHTML = "";
  const aromatizadores = await pegarTodosOsAromatizadores();
  aromatizadores.forEach((aro) => {
    produtosContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="produtos__container__card card" id="${aro._id}">
    <h3>${aro.fragrance}</h3>
    <img src="${aro.image}" alt=" ${aro.fragrance}">
    <p>${aro.description}</p>
    <p>R$${aro.price.toFixed(2)}</p>
  </div>`
    );
  });
}

async function imprimirProdutosAdmin() {
  const adminProdutos = document.querySelector(".admin__produtos");
  adminProdutos.innerHTML = "";
  const aromatizadores = await pegarTodosOsAromatizadores();
  aromatizadores.forEach((aro) => {
    adminProdutos.insertAdjacentHTML(
      "beforeend",
      `<div class="admin__produtos__card card" id="${aro._id}">
  <h3>${aro.fragrance}</h3>
  <img src="${aro.image}" alt=" ${aro.fragrance}">
  <p>${aro.description}</p>
  <p>R$${aro.price.toFixed(2)}</p>
  <p><span>ID: </span> <span>${aro._id}</span></p>
  <div class="admin__produtos__card__control">
  <button class="btn" onclick="abrirModal('${aro._id}')">Update</button>
  <button class="btn" onclick="deletarAromatizador('${
    aro._id
  }')">Delete</button>
  </div>
</div>`
    );
  });
}

async function cadastroAromatizador(body) {
  const url = `${baseUrl}/create`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(body),
  });
  if (response.status === 201) {
    return await response.json();
  } else {
    return false;
  }
}

async function cadastrarAromatizadorResposta() {
  const body = {
    fragrance: document.querySelector("[name='fragrance']").value,
    description: document.querySelector("[name='description']").value,
    price: Number(document.querySelector("[name='price']").value),
    image: document.querySelector("[name='image']").value,
  };
  const resObj = await cadastroAromatizador(body);
  if (resObj) {
    Swal.fire({
      title: "Aromatizador cadastrado",
      icon: "success",
      confirmButtonText: "Ok",
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Fragrance already exists",
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
  imprimirProdutosAdmin();
  imprimirTodosOsProdutos();
}

async function deletarAromatizador(id) {
  const modal = await Swal.fire({
    title: "Tem certeza que quer excluir o aromatizador?",
    text: "Essa ação é irreversível!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim, delete!",
  });
  if (modal.isConfirmed) {
    const response = await fetch(`${baseUrl}/delete/${id}`, {
      method: "delete",
      mode: "cors",
    });
    if (response.status === 200) {
      Swal.fire({
        title: "Aromatizador deletado",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro na deleção",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    imprimirProdutosAdmin();
    imprimirTodosOsProdutos();
  }
}

async function abrirModal(id = false) {
  if (!id) {
    document.querySelector(".modal__container__header__h3").innerText =
      "Cadastre um novo produto";
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector("[name='fragrance']").value = "";
    document.querySelector("[name='description']").value = "";
    document.querySelector("[name='price']").value = 0;
    document.querySelector("[name='image']").value = "";
    document
      .querySelector(".cadastroOuAtualizar")
      .addEventListener("click", async () => {
        await cadastrarAromatizadorResposta();
      });
  } else {
    const aromatizador = await pegarAromatizadorPorId(id);
    document.querySelector(".modal__container__header__h3").innerText =
      "Atualize o produto:";
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector(
      "[name='fragrance']"
    ).value = `${aromatizador.fragrance}`;
    document.querySelector(
      "[name='description']"
    ).value = `${aromatizador.description}`;
    document.querySelector("[name='price']").value = aromatizador.price;
    document.querySelector("[name='image']").value = `${aromatizador.image}`;
    document
      .querySelector(".cadastroOuAtualizar")
      .addEventListener("click", async () => {
        await cadastroOuAtualizarAromatizador(id);
      });
  }
}
function fecharModal() {
  document.querySelector("#modal").classList.add("hidden");
}
function abrirAdmin() {
  document.querySelector("#admin").classList.toggle("hidden");
  imprimirProdutosAdmin();
}
imprimirTodosOsProdutos();
