const baseUrl = "http://localhost:3000/";

// const baseUrl = "https://apifazendoarte-production.up.railway.app/aromatizador";
async function pegarTodosOsAromatizadores() {
  const response = await fetch(`${baseUrl}aromatizador/all`);
  const aromatizadores = await response.json();
  return aromatizadores;
}
async function pegarAromatizadorPorId(id) {
  const response = await fetch(`${baseUrl}aromatizador/id/${id}`);
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
    <div class="produtos__container__card__price">
    <p>R$${aro.price.toFixed(2)}</p>
  <i class="fa-solid fa-cart-arrow-down" onclick="adicionarItemCarrinho('${
    aro._id
  }')"></i>
</div>
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
  <button class="btn" onclick="abrirModalId('${aro._id}')">Atualizar</button>
  <button class="btn" onclick="deletarAromatizador('${
    aro._id
  }')">Deletar</button>
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
  const url = `${baseUrl}aromatizador/create`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
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
    const response = await fetch(`${baseUrl}aromatizador/delete/${id}`, {
      method: "delete",
      headers: {
        authorization: `bearer ${localStorage.access_token}`,
      },
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
  await atualizarAromatizador(id, body);
}
async function atualizarAromatizador(id, body) {
  const response = await fetch(`${baseUrl}aromatizador/update/${id}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
    },
    mode: "cors",
    body: JSON.stringify(body),
  });
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

async function pesquisarPorId() {
  const pesquisa = document.querySelector("[name='pesquisaId']").value;
  const resultado = await pegarAromatizadorPorId(pesquisa);
  const mostraResultado = document.querySelector(
    ".admin__resultado--pesquisaID"
  );
  mostraResultado.innerHTML = "";
  if (resultado.error) {
    mostraResultado.innerHTML = "Id inválida!";
  } else {
    mostraResultado.insertAdjacentHTML(
      "beforeend",
      `<div class="admin__produtos__card card" id="${resultado._id}">
    <h3>${resultado.fragrance}</h3>
    <img src="${resultado.image}" alt=" ${resultado.fragrance}">
    <p>${resultado.description}</p>
    <p>R$${resultado.price.toFixed(2)}</p>
    <p><span>ID: </span> <span>${resultado._id}</span></p>
    <div class="admin__produtos__card__control">
    <button class="btn" onclick="abrirModalId('${
      resultado._id
    }')">Update</button>
    <button class="btn" onclick="deletarAromatizador('${
      resultado._id
    }')">Delete</button>
    </div>`
    );
  }
  mostraResultado.classList.remove("hidden");
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

async function login() {
  const email = document.querySelector("[name='loginEmail']").value;
  const password = document.querySelector("[name='loginPassword']").value;
  const body = {
    email,
    password,
  };
  const request = await fetch(`${baseUrl}usuario/signin`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(body),
  });
  if (request.status === 200) {
    Swal.fire({
      title: "Logado",
      icon: "success",
      confirmButtonText: "Ok",
    });
    const response = await request.json();
    localStorage.setItem("access_token", response.token);
    localStorage.setItem("name", response.name);
    localStorage.setItem("adm", response.adm);
    localStorage.setItem("email", response.email);
    document.querySelector(
      ".greetings__message"
    ).innerText = `${response.name}`;
    const loginArea = document.querySelector("#login");
    loginArea.innerHTML = "";
    loginArea.insertAdjacentHTML(
      "afterbegin",
      `<h3>Logado como ${localStorage.name}.</h3>
    <button class="btn logoutBt" onclick="logout()">Logout</button>
    <button class="btn loginBt" onclick="abrirLogin()">Login</button>`
    );
    abrirLoginMenu();
    imprimirMenuCarrinho();
    if (response.adm) {
      abrirAdmin();
      document.querySelector(
        ".greetings__message"
      ).innerText = `${response.name}`;
      document.querySelector(".navList").insertAdjacentHTML(
        "beforeend",
        `<li class="adminBt">
      <button class="btn" onclick="abrirAdmin()">admin</button>
    </li>`
      );
    }
  } else {
    Swal.fire({
      title: "Erro ao logar!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    localStorage.setItem("access_token", "");
  }
}

async function signup() {
  const name = document.querySelector("[name='signupName']").value;
  const email = document.querySelector("[name='signupEmail']").value;
  const password = document.querySelector("[name='signupPassword']").value;
  const passwordVerify = document.querySelector(
    "[name='signupPasswordVerify']"
  ).value;
  if (password !== passwordVerify) {
    Swal.fire({
      title: "As senhas não são iguais!",
      icon: "error",
      confirmButtonText: "Ok",
    });
    return;
  }
  const body = {
    name,
    email,
    password,
  };
  const request = await fetch(`${baseUrl}usuario/create`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(body),
  });
  if (request.status === 201) {
    Swal.fire({
      title: `${name} cadastrado com sucesso!`,
      icon: "success",
      confirmButtonText: "Ok",
    });
  } else {
    const response = await request.json();
    Swal.fire({
      title: "Erro!",
      text: `${response.message}`,
      icon: "error",
      confirmButtonText: "Ok",
    });
  }
}

async function logout() {
  const modal = await Swal.fire({
    title: "Certeza que quer deslogar?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sim",
    cancelButtonText: "Não!",
  });
  if (modal.isConfirmed) {
    limparCarrinhoMenu();
    Swal.fire("Usuário deslogado.");
    const adminBt = document.querySelector(".adminBt");
    if (adminBt) {
      adminBt.remove();
    }
    localStorage.clear();
    document.querySelector("#admin").classList.toggle("hidden", true);
    document.querySelector(".greetings__message").innerText = `Visitante`;
    const loginArea = document.querySelector("#login");
    loginArea.innerHTML = "";
    loginArea.insertAdjacentHTML(
      "afterbegin",
      `<fieldset>
    <label for="loginEmail">E-mail:</label>
    <input
      type="email"
      placeholder="exemplo@gmail.com"
      name="loginEmail"
      required
    />
  </fieldset>
  <fieldset>
    <label for="loginPassword">Senha:</label>
    <input type="password" name="loginPassword" required />
  </fieldset>
  <button class="btn" onclick="login()">Login</button>
  <button class="btn loginBt" onclick="abrirLogin()">Login</button>`
    );
  }
}

function checkLogin() {
  if (localStorage.length != 0) {
    document.querySelector(
      ".greetings__message"
    ).innerText = `${localStorage.name}`;

    const loginArea = document.querySelector("#login");
    loginArea.innerHTML = "";
    loginArea.insertAdjacentHTML(
      "afterbegin",
      `<h3>Logado como ${localStorage.name}.</h3>
    <button class="btn logoutBt" onclick="logout()">Logout</button>
    <button class="btn loginBt" onclick="abrirLogin()">Login</button>`
    );
    imprimirMenuCarrinho();
    if (localStorage.adm) {
      document.querySelector(".navList").insertAdjacentHTML(
        "beforeend",
        `<li class="adminBt">
      <button class="btn" onclick="abrirAdmin()">admin</button>
    </li>`
      );
    }
  }
}

function showCart() {
  document.querySelector("#cartMenu").classList.toggle("hidden");
}

async function pegarCarrinhoUsuario() {
  const request = await fetch(`${baseUrl}usuario/email`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
    },
    mode: "cors",
    body: JSON.stringify({ email: localStorage.email }),
  });
  const response = await request.json();
  return response.cart;
}
async function imprimirMenuCarrinho() {
  let total = 0;
  let productQuantity = 0;
  const cartMenu = document.querySelector("#cartMenu");
  cartMenu.innerHTML = "";
  const cart = await pegarCarrinhoUsuario();
  cart.forEach((item) => {
    cartMenu.insertAdjacentHTML(
      "beforeend",
      `
    <div id="cartMenu__${item.product._id}" class="cartItem">
  <img src="${item.product.image}" alt="">
  <p>${item.product.fragrance}</p>
  <div class="itemControl">
    <i class="fa-solid fa-plus" onclick="adicionarItemCarrinho('${item.product._id}')"></i>
    <p>${item.quantity}</p>
    <i class="fa-solid fa-minus" onclick="tirarItemCarrinho('${item.product._id}')"></i>
    <i class="fa-solid fa-trash-can" onclick="deletarItem('${item.product._id}')"></i>
  </div>
</div>
    `
    );
    total += item.product.price * item.quantity;
    productQuantity += item.quantity;
  });
  cartMenu.insertAdjacentHTML(
    "beforeend",
    `<h3>Total : R$${total.toFixed(2)}</h3>`
  );
  document.querySelector(".cartQuantity").classList.remove("hidden");
  document.querySelector(".cartQuantity").innerText = productQuantity;
  setTimeout(() => {
    document.querySelector(".cartQuantity").classList.add("hidden");
  }, 2000);
}

function abrirLogin() {
  document.querySelector("#signup").classList.remove("onTop");
  document.querySelector("#login").classList.add("onTop");
}

function abrirLoginMenu() {
  document.querySelector("#loginMenu").classList.toggle("hidden");
}
function abrirSignup() {
  document.querySelector("#signup").classList.add("onTop");
  document.querySelector("#login").classList.remove("onTop");
}

async function adicionarItemCarrinho(id) {
  const request = await fetch(`${baseUrl}usuario/additem`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
    },
    mode: "cors",
    body: JSON.stringify({ email: localStorage.email, product: id }),
  });
  const response = await request.json();
  imprimirMenuCarrinho();
}

async function tirarItemCarrinho(id) {
  const request = await fetch(`${baseUrl}usuario/deleteoneitem`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
    },
    mode: "cors",
    body: JSON.stringify({ email: localStorage.email, product: id }),
  });
  imprimirMenuCarrinho();
}

function limparCarrinhoMenu() {
  document.querySelector("#cartMenu").innerHTML =
    "<p>Faça login para Adicionar produtos</p>";
}

async function deletarItem(id) {
  const request = await fetch(`${baseUrl}usuario/deleteitem`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      authorization: `bearer ${localStorage.access_token}`,
    },
    mode: "cors",
    body: JSON.stringify({ email: localStorage.email, product: id }),
  });
  const response = await request.json();
  imprimirMenuCarrinho();
  console.log(response);
}

checkLogin();
imprimirTodosOsProdutos();
