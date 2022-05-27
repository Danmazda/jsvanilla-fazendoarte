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
  <button class="btn" onclick="abrirModalId('${aro._id}')">Update</button>
  <button class="btn" onclick="deletarAromatizador('${
    aro._id
  }')">Delete</button>
  </div>
  <section id="card_${aro._id}" class="hidden modal">
          <div class="modal__container">
            <div class="modal__container__header">
              <h3 class="modal__container__header__h3">Atualize o produto</h3>
              <span onclick="fecharModalId('${aro._id}')">X</span>
            </div>
            <fieldset>
              <label for="fragrance">Aroma</label>
              <input type="text" name="fragrance" class="fragrance_${aro._id}"
              value= "${aro.fragrance}"/>
            </fieldset>
            <fieldset>
              <label for="description">Descrição</label>
              <input type="text" name="description" class="description_${
                aro._id
              }" value="${aro.description}"/>
            </fieldset>
            <fieldset>
              <label for="image">Image</label>
              <input type="url" name="image" class="image_${aro._id}" value="${
        aro.image
      }"/>
            </fieldset>
            <fieldset>
              <label for="price">Preço</label>
              <input
                type="number"
                min="1"
                max="1000"
                name="price"
                step="0.01"
                value="${aro.price}"
                class="price_${aro._id}"
              />
            </fieldset>
            <button class="btn" onclick="atualizar('${
              aro._id
            }')">Enviar</button>
          </div>
        </section>
</div>`
    );
  });
}

function abrirModalId(id) {
  document.querySelector(`#card_${id}`).classList.remove("hidden");
}
function fecharModalId(id) {
  document.querySelector(`#card_${id}`).classList.add("hidden");
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
async function atualizar(id) {
  const body = {
    fragrance: document.querySelector(`.fragrance_${id}`).value,
    description: document.querySelector(`.description_${id}`).value,
    price: Number(document.querySelector(`.price_${id}`).value),
    image: document.querySelector(`.image_${id}`).value,
  };
  console.log(body);
  await atualizarAromatizador(id, body);
}
async function atualizarAromatizador(id, body) {
  const response = await fetch(`${baseUrl}/update/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(body),
  });
  console.log("ENTREI");
  if (response.status === 200) {
    Swal.fire({
      title: "Aromatizador atualizado com sucesso",
      icon: "success",
      confirmButtonText: "Ok",
    });
  } else {
    const e = await response.json();
    Swal.fire({
      title: "Erro!",
      text: `${e.error}`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
  imprimirProdutosAdmin();
  imprimirTodosOsProdutos();
}

async function abrirModalAtualizar(id) {
  console.log("halo");
}

async function abrirModalCadastro() {
  document.querySelector(".modal__container__header__h3").innerText =
    "Cadastre um novo produto";
  document.querySelector("#modal").classList.remove("hidden");
  document.querySelector("[name='fragrance']").value = "";
  document.querySelector("[name='description']").value = "";
  document.querySelector("[name='price']").value = 0;
  document.querySelector("[name='image']").value = "";
}
function fecharModal() {
  document.querySelector("#modal").classList.add("hidden");
}
function abrirAdmin() {
  document.querySelector("#admin").classList.toggle("hidden");
  imprimirProdutosAdmin();
}
imprimirTodosOsProdutos();
