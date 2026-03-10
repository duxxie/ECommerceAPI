import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

const objCampos = {
    
}

export function perfil(root) {
    
    const user = JSON.parse(localStorage.getItem('userLogado'))

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
            <div class="profile-field" id="nome">
                <div class="campo-info"> 
                    <span class="label">Nome completo</span>
                    <span class="value">${user.nome}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
                
            </div>
            <div class="profile-field" id="email">
                <div class="campo-info"> 
                    <span class="label">E-mail</span>
                    <span class="value">${user.email}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
            <div class="profile-field" id="telefone">
                <div class="campo-info"> 
                    <span class="label">Telefone</span>
                    <span class="value">${user.telefone}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
            <div class="profile-field" id="endereco">
                <div class="campo-info"> 
                    <span class="label">Endereço</span>
                    <span class="value">${user.endereco}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
          </div>

          <div class="profile-actions" id="actions-profile">
            <button class="btn btn-primary" id="btn-ver-pedidos">
              📦 Ver pedidos
            </button>
            <button class="btn-cart btn-outline" id="carrinho">
                <span class="icon-cart" aria-hidden="true">
                    🛒
                </span>
                <span>Carrinho</span>
                <span class="cart-badge" id="cart-quant">7</span>
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

function handlerActionsInfoUsuario(user) {
    // document.getElementById('info-usuario').addEventListener('click', (e) => {
    //     const elementoClicado = e.target;
    //     if(!elementoClicado.classList.contains('btn-outline')) return;

    //     const cardInfo = elementoClicado.closest('.profile-field');
    //     console.log(`Id do card => ${cardInfo.id}`);

    //     mostrarCampoParaAlteracao(cardInfo.id, user);
    // });

    function mostrarCampos(root, user) {
    root.innerHTML = `
        <div class="profile-field" id="nome">
                <div class="campo-info"> 
                    <span class="label">Nome completo</span>
                    <span class="value">${user.nome}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
                
            </div>
            <div class="profile-field" id="email">
                <div class="campo-info"> 
                    <span class="label">E-mail</span>
                    <span class="value">${user.email}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
            <div class="profile-field" id="telefone">
                <div class="campo-info"> 
                    <span class="label">Telefone</span>
                    <span class="value">${user.telefone}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
            <div class="profile-field" id="endereco">
                <div class="campo-info"> 
                    <span class="label">Endereço</span>
                    <span class="value">${user.endereco}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            </div>
    `
}

}


function handlerActionsProfile() {
    document.getElementById('actions-profile').addEventListener('click', (e) => {
        const elementoClicado = e.target;

        if(elementoClicado.id === "btn-voltar") {
            setNavegacaoState('home');
            render();
        }
        else if(elementoClicado.id === "carrinho") {
            console.log("Mostrar carrinho");
        }
        else if(elementoClicado.id === "btn-ver-pedidos") {
            console.log("Ver pedidos");
        }
        else {
            return
        }
    });

}

function mostrarCampoParaAlteracao(idElemento, user) {
    
    const elemento = document.getElementById(idElemento);
    
    const valorInput = idElemento === "nome" ? user.nome :
        idElemento === "email" ? user.email :
        idElemento === "telefone" ? user.telefone :
        user.endereco;

    elemento.innerHTML = `
        <div class="campo-info"> 
            <span class="label">Nome</span>
            <input type="text" id="nome" value="${valorInput}">
        </div>  
        <div id="edit-caixa" class="caixa-edit">
            <button class="btn-outline-perfil btn-cancelar-edicao" id="btn-cancelar-edicao">
                ✖️ Cancelar
            </button>
            <button class="btn-outline-perfil btn-outline-strong btn-salvar-edicao" id="btn-salvar-edicao">
                ✔️ Salvar alterações
            </button>
        </div>
    `

    document.getElementById('edit-caixa').addEventListener('click', (e) => {
        const elementoClicado = e.target;

        if(!elementoClicado.classList.contains('btn-outline-perfil')) return;

        if(elementoClicado.id === "btn-cancelar-edicao") {
            elemento.innerHTML = `
                <div class="campo-info"> 
                    <span class="label">${idElemento}</span>
                    <span class="value">${valorInput}</span>
                </div>  
                <button class="btn-outline">
                    ✏️ Editar
                </button>
            `
        }
    });
    
}