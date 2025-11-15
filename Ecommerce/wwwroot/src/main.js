const API = 'http://localhost:5039';

async function carregarProdutos() {
  const resposta = await fetch(`${API}/produtos`);
  const produtos = await resposta.json();
  return produtos;
}

import { home } from "./pages/home.js";
import { cadastro } from "./pages/cadastro.js";
import { getNavegacaoState } from "./helpers/stateNavegacao.js";
import { login } from "./pages/login.js";

export async function render() {
    let root = document.getElementById('root');
    const produtos = await carregarProdutos()
    const navegacao = getNavegacaoState();

    if(navegacao == "home" || navegacao.length == 0) {
      home(root, produtos);
    }
    else if(navegacao == "cadastro") {
      cadastro(root);
    }
    else if(navegacao == "login") {
      login(root)
    }
    //cadastro(root)
}

render();
