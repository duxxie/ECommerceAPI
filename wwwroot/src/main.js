export const API = 'http://localhost:5039';

async function carregarProdutos() {
  const resposta = await fetch(`${API}/produtos`);
  const produtos = await resposta.json();
  return produtos;
}

import { home } from "./pages/home.js";
import { cadastro } from "./pages/cadastro.js";
import { getNavegacaoState } from "./helpers/stateNavegacao.js";
import { login } from "./pages/login.js";
import { perfil } from "./pages/perfil.js";
import { carrinho } from "./pages/carrinho.js";

export async function render() {
    let root = document.getElementById('root');
    const produtos = await carregarProdutos()
    const navegacao = getNavegacaoState();
    console.log("Navegaçao =>> ", navegacao)
    if(navegacao === "home" || navegacao.length === 0) {
      home(root, produtos);
    }
    else if(navegacao === "cadastro") {
      cadastro(root, API);
    }
    else if(navegacao === "login") {
      login(root, API)
    }
    else if(navegacao === "perfil") {
      perfil(root);
    }
    else if(navegacao === "carrinho") {
      carrinho(root, produtos);
    }
    //cadastro(root)
}

render();
