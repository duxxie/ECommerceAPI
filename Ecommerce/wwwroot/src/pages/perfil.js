import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";
import { API } from "../main.js";

let objCampos = [
    {idCampo: "nome" ,nomeCampo: "Nome completo", edit: false},
    {idCampo: "email" ,nomeCampo: "E-mail", edit: false},
    {idCampo: "telefone" ,nomeCampo: "telefone", edit: false},
    {idCampo: "endereco" ,nomeCampo: "Endereço", edit: false}
]

function carregarCarrinhoLocalStorage() {
  const str = localStorage.getItem('carrinho');
  return str ? JSON.parse(str) : null;
}

export function perfil(root) {
    const carrinho = carregarCarrinhoLocalStorage();
    const user = JSON.parse(localStorage.getItem('usuarioLogado'))

    let quantItens = 0

    carrinho.itens.forEach(item => {
        quantItens += item.quantidade;
    });

    root.innerHTML = ''

    root.innerHTML = `
    <div class="app-shell-perfil profile-page">
      <main class="profile-layout">
        <section class="profile-card">
          <header class="profile-card-header">
            <div class="profile-avatar" aria-hidden="true">
              <span>${user.primeiroNome.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 class="profile-name">${user.nome}</h2>
              <p class="profile-email">${user.email}</p>
            </div>
          </header>

          <div class="profile-info-grid" id="info-usuario">
            
          </div>

          <div class="profile-actions" id="actions-profile">
            <button class="btn-outline btn-logout" id="btn-logout">
                Encerrar Sessão
            </button>
          <button class="btn btn-primary" id="btn-ver-pedidos">
              📦 Ver pedidos
            </button>
            <button class="btn-cart btn-outline" id="carrinho">
                <span class="icon-cart span-no-click" aria-hidden="true">
                    🛒
                </span>
                <span class="span-no-click">Carrinho</span>
                <span class="cart-badge span-no-click" id="cart-quant">${quantItens}</span>
            </button>
            <button class="btn-outline btn-ghost" id="btn-voltar">
              ← Voltar
            </button>
          </div>
        </section>
      </main>
    </div>
  `;

  handlerActionsProfile();
  handlerActionsInfoUsuario(user);
}

function pegarValorDado(user, campo) {
    let valor = null;

    switch(campo) {
        case "nome": 
            valor = user.nome
            break;
        case "email": 
            valor = user.email
            break;
        case "telefone":
            valor = user.telefone
            break;
        case "endereco":
            valor = user.endereco
            break;
    }

    return valor;
}

function handlerActionsInfoUsuario(user) {

    const elemento = document.getElementById('info-usuario')
    function mostrarCampos(root, user) {
    console.log(objCampos);
        const campos = objCampos.map(campo =>
        campo.edit === true ?      
             ` 
            <div class="profile-field" id="${campo.idCampo}">
                <div class="campo-info"> 
                        <span class="label">${campo.nomeCampo}</span>
                        <input type="text" id="${campo.idCampo}" class="input-alt" value="${pegarValorDado(user, campo.idCampo)}">
                    </div>  
                    <div id="edit-caixa" class="caixa-edit">
                        <button class="btn-outline btn-cancelar-edicao" id="btn-cancelar-edicao">
                        ✖️ Cancelar
                        </button>
                        <button class="btn-outline btn-outline-strong btn-salvar-edicao" id="btn-salvar-edicao">
                        ✔️ Salvar alterações
                    </button>
                </div>
            </div>
            `
        :
            `
        <div class="profile-field" id="${campo.idCampo}">
            <div class="campo-info">
            <span class="label">${campo.nomeCampo}</span>
            <span class="value">${pegarValorDado(user, campo.idCampo)}</span>
        </div>
        <button class="btn-outline" id="editar">
            ✏️ Editar
        </button>
        </div>
        `
        )
        
        const camposString = campos.join('');

        root.innerHTML = `
            ${camposString}
        `
    }

    mostrarCampos(elemento, user)

    elemento.addEventListener('click', async (e) => {
        const elementoClicado = e.target;
        
        if(!elementoClicado.classList.contains('btn-outline')) return;

        const campo = e.target.closest('.profile-field');
        const idCampo = campo.id

        if(elementoClicado.id === "editar") {
            objCampos = objCampos.map(campo => campo.idCampo === idCampo ? {...campo, ...{edit: !campo.edit}} : campo);
            mostrarCampos(elemento, user);
        }
        else if(elementoClicado.id === "btn-cancelar-edicao") {
            objCampos = objCampos.map(campo => campo.idCampo === idCampo ? {...campo, ...{edit: !campo.edit}} : campo);
            mostrarCampos(elemento, user);
        }
        else if(elementoClicado.id === "btn-salvar-edicao") {
            const inputElement = campo.querySelector('.input-alt');
            const idInput = inputElement.id;
            const inputValue = inputElement.value;
            const novoCliente = idInput === "nome" ? {...user, ...{nome: inputValue}} :
                idInput === "email" ? {...user, ...{email: inputValue}} :
                idInput === "telefone" ? {...user, ...{telefone: inputValue}} :
                {...user, ...{endereco: inputValue}};
            console.log(novoCliente);
            const resposta = await fetch(`${API}/clientes/${novoCliente.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(novoCliente)
            });

            const clienteAlterado = await resposta.json();

            localStorage.setItem('usuarioLogado', JSON.stringify(clienteAlterado));

            objCampos = objCampos.map(campo => campo.idCampo === idCampo ? {...campo, ...{edit: !campo.edit}} : campo);
            mostrarCampos(elemento, user);

            render();
        }
        else {
            return
        }
        
    });

}

function handlerActionsProfile() {
    document.getElementById('actions-profile').addEventListener('click', (e) => {
        const elementoClicado = e.target;

        if(elementoClicado.id === "btn-voltar") {
            setNavegacaoState('home');
            render();
        }
        else if(elementoClicado.id === "carrinho") {
           setNavegacaoState('carrinho');
           render()
        }
        else if(elementoClicado.id === "btn-ver-pedidos") {
            console.log("Ver pedidos");
        }
        else if(elementoClicado.id === "btn-logout") {
            localStorage.removeItem('usuarioLogado');
            localStorage.removeItem('carrinho');
            setNavegacaoState('home');
            render();
        }
        else {
            return
        }
    });

}
