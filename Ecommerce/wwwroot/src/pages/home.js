import { formatarMoeda } from "../helpers/formatMoeda.js";
import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { API, render } from "../main.js";



// const API = 'http://localhost:5039';


// async function carregarProdutos() {
//   const resposta = await fetch(`${API}/produtos`);
//   const produtos = await resposta.json();
//   return produtos;
// }

async function mostrarProdutos(produtos, usuarioLogado) {
  console.log(produtos)
  const produtosArrString = produtos.map(produto => 
    `
      <article class="product-card" id="${produto.id}">
        <div>
          <div class="header-badge"> 
            <span class="badge badge-green">Em estoque</span>
          </div>
          <div class="product-card-header">
            <div class="product-name">${produto.nome}</div>
            <div class="product-code">Código: ${produto.id}</div>
          </div>
          <div class="product-meta">
            <strong>Categoria:</strong> ${produto.categoria}
          </div>
          <div class="price">
            ${formatarMoeda(produto.preco)}
            <small>ou 10x de R$ 629,90 sem juros</small>
          </div>
          <div class="stock-soft">Estoque: ${produto.estoque} unidades</div>
        </div>
        <div class="product-card-footer">
            <button class="${usuarioLogado ? "btn-ghost" : "btn-ghost btn-disable"}">
              Adicionar ao carrinho
            </button>
        </div>
      </article>
    `
  );

  const produtosString = produtosArrString.join('');
  
  return produtos.length > 0 ? produtosString : `<p>Nenhum produto encontrado...</p>`;
}

async function mostrarSumario(totalProdutos, totalProdutosCategoria, totalEstoque, totalEstoqueCategoria, nomeCategoria, quantidadeCarrinho, valorTotalCarrinho) {

  return `
      <article class="summary-card">
        <div class="summary-title">Produtos disponíveis</div>
        <div class="summary-main">
          <span>${totalProdutos}</span>
          <small>itens ativos</small>
        </div>
        <div class="summary-sub">em todas as categorias cadastradas</div>
      </article>

      <article class="summary-card" id="disp-categorias">
        <div class="summary-title">Produtos disponíveis para ${nomeCategoria}</div>
        <div class="summary-main">
          <span>${totalProdutosCategoria}</span>
          <small>itens ativos</small>
        </div>
        <div class="summary-sub">em ${nomeCategoria}</div>
      </article>

      <article class="summary-card">
        <div class="summary-title">Total itens em estoque</div>
        <div class="summary-main">
          <span>${totalEstoque}</span>
          <small>para pronta entrega</small>
        </div>
        <div class="summary-sub">atualização em tempo real</div>
      </article>

      <article class="summary-card" id="estoque-categoria">
        <div class="summary-title">Total em estoque para ${nomeCategoria}</div>
        <div class="summary-main">
          <span>${totalEstoqueCategoria}</span>
          <small>para pronta entrega</small>
        </div>
      <div class="summary-sub">atualização em tempo real</div>
      </article>

      <article class="summary-card">
        <div class="summary-title">No carrinho</div>
        <div class="summary-main">
          <span>${quantidadeCarrinho}</span>
          <small>itens selecionados</small>
        </div>
        <div class="summary-sub">Subtotal aproximado: ${formatarMoeda(valorTotalCarrinho)}</div>
      </article>
  `
  
}

const categorias = ['Notebooks', 'Smartphones', 'Periféricos', 'Acessórios','Áudio', 'Monitores', 'Armazenamento', 'Wearables', 'Tablets', 'Câmeras', 'TVs', 'Redes'];

export async function home(root, produtos) {

  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuarioLogado = usuario !== null;
  // const listProdutos = await carregarProdutos();
  root.innerHTML = '';

  root.innerHTML = `
  <div class="app-shell-home">

    <header class="app-header-home">
      <div class="h1-busca">
        <h1 class="h1-header">G3E-Ecommerce</h1>
        <div class="busca-style">
          <label for="busca" class="p-header">Buscar produto</label>
          <input id="busca" type="text" placeholder="nome ou código do produto" />
        </div>
      </div>
      <div class="header-actions" id="actions">
        <button class="${usuarioLogado ? 'btn btn-primary btn-disable' : 'btn btn-primary'}" id="login">Fazer login</button>

        <button id="perfil" class="${usuarioLogado ? 'btn-outline btn-profile' : "btn-outline btn-profile btn-disable"}">
          <span class="icon-profile span-no-click" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="8"
                r="4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M4 20c0-3.5 4-5.5 8-5.5s8 2 8 5.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="span-no-click">${usuarioLogado ? usuario.primeiroNome : 'User'}</span>
        </button>
       
        <button class="btn-cart ${usuarioLogado ? "btn-outline" : "btn-outline btn-disable"}" id="carrinho">
          <span class="icon-cart span-no-click" aria-hidden="true">
            🛒
          </span>
          <span class="span-no-click">Carrinho</span>
          <span class="cart-badge span-no-click" id="cart-quant"></span>
        </button>
        <button class="${usuarioLogado ? "btn-outline btn-outline-strong" : "btn-outline btn-outline-strong btn-disable"}" id="fim-compra">Finalizar compra</button>
      </div>
    </header>

    <section class="filter-bar">
      <div class="filter-group">
        <label for="categoria">Categoria</label>
        <select id="categoria">
          <option value="">Todas as categorias</option>
          <option value="Notebooks">Notebooks</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Periféricos">Periféricos</option>
          <option value="Acessórios">Acessórios</option>
          <option value="Áudio">Áudio</option>
          <option value="Monitores">Monitores</option>
          <option value="Armazenamento">Armazenamento</option>
          <option value="Wearables">Wearables</option>
          <option value="Tablets">Tablets</option>
          <option value="Câmeras">Câmeras</option>
          <option value="TVs">TVs</option>
          <option value="Redes">Redes</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="preco">Faixa de preço</label>
        <select id="preco">
          <option value="">Qualquer valor</option>
          <option value="até-500">Até R$ 500,00</option>
          <option value="500-2000">R$ 500,00 a R$ 2.000,00</option>
          <option value="acima-2000">Acima de R$ 2.000,00</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ordenar">Ordenar por</label>
        <select id="ordenar">
          <option value="">Nenhum</option>
          <option value="menor preco">Menor preço</option>
          <option value="maior preco">Maior preço</option>
          <option value="mais estoque">Mais estoque</option>
          <option value="menos estoque">Menos estoque</option>
        </select>
      </div>
    </section>

    <section class="summary-grid" id="sumario">
      
    </section>

    <section id="produtos" class="products-grid" aria-label="Lista de produtos em cards">
    </section>
  </div>
  `;

  handlerListaProdutos(produtos, usuarioLogado);
  handlerActions()
}

function handlerActions() {
  document.getElementById('actions').addEventListener('click', (e) => {
    const elementoClicado = e.target

    if(elementoClicado.id === "login") {
      setNavegacaoState('login');
      render();
    } 
    else if(elementoClicado.id === "carrinho") {
      setNavegacaoState('carrinho');
      render();
    }
    else if(elementoClicado.id === "fim-compra") {
      console.log("clicou em finalizar compra!!");
    }
    else if(elementoClicado.id === "perfil") {
      setNavegacaoState('perfil')
      render()
    }
    else {
      return;
    }

  });
}

function carregarCarrinho() {
  const str = localStorage.getItem('carrinho');
  return str ? JSON.parse(str) : null;
}

async function handlerListaProdutos(produtos, usuarioLogado, quantidade = 1) {
  console.log(produtos)
  let carrinho = carregarCarrinho()
  const selectCategoria = document.getElementById('categoria');
  const containerProdutos = document.getElementById('produtos');
  const selecPreco = document.getElementById('preco');
  const selectOrdenar = document.getElementById('ordenar');
  const inputBusca = document.getElementById('busca');
  const sumario = document.getElementById('sumario');
  const quantidadeCarrinho = document.getElementById('cart-quant');

  async function mostrarProdutosFiltrados() {
    const carrinhoInside = carregarCarrinho();
    const categoriaSelect = selectCategoria.value;
    const precoSelec = selecPreco.value;
    const ordemSelec = selectOrdenar.value;

    const produtosFiltradoCategoria = categoriaSelect ? produtos.filter(p => p.categoria === categoriaSelect) : produtos;

    const produtosFiltradosPreco = precoSelec ? produtosFiltradoCategoria.filter(p => {
      const precoRetorno = 
        precoSelec === 'até-500' ? p.preco <= 500 :
        precoSelec === '500-2000' ? p.preco >= 500 && p.preco <= 2000 :
        p.preco > 2000;
      
      return precoRetorno;
    }) : produtosFiltradoCategoria

    let prod

    if(ordemSelec) {
      if(ordemSelec === 'menor preco') {
        prod = [...produtosFiltradosPreco].sort((a,b) => a.preco - b.preco);
      }
      else if(ordemSelec === 'maior preco') {
        prod = [...produtosFiltradosPreco].sort((a,b) => b.preco - a.preco);
      }
      else if(ordemSelec === 'mais estoque') {
        prod = [...produtosFiltradosPreco].sort((a,b) => b.estoque - a.estoque);
      }
      else if(ordemSelec === 'menos estoque') {
        prod = [...produtosFiltradosPreco].sort((a,b) => a.estoque - b.estoque);
      }
    } else {
      prod = produtosFiltradosPreco
    }

    const produtosBuscaComInput = prod.filter(p => {
      if(inputBusca.value.length < 1) return true;

      const nomeProduto = p.nome.toLowerCase();
      const nomeBusca = inputBusca.value.toLowerCase().trim();
      const numeroIdBusca = Number(nomeBusca);
      if(!isNaN(numeroIdBusca)) {
       console.log("entrou aqui no parse int")
        return numeroIdBusca === p.id
      } else {
        console.log("nao entrou no parse int")
        return nomeProduto.includes(nomeBusca);
      }
    })

    let totalEstoqueCategoria = 0;
    produtosBuscaComInput.forEach(p => {
      totalEstoqueCategoria += p.estoque;
    })

    let totalEstoque = 0;
    produtos.forEach(p => {
      totalEstoque += p.estoque;
    })
    
    let valorTotalCarrinho = 0;
    let quant = 0
    if(carrinhoInside) {
      carrinhoInside.itens.forEach(item => {
      quant += item.quantidade

      const produto = produtos.find(p => Number(p.id) === Number(item.produtoId));
      console.log(produto)
      if(!produto) return;

      const preco = produto.preco;

      const subtotal = preco * item.quantidade;
      console.log(`subtotal => ${subtotal}`)
      valorTotalCarrinho += subtotal;
      console.log(`valor total => ${valorTotalCarrinho}`);

    });
    }

    quantidadeCarrinho.innerHTML = quant
    const totalProdutosCategoria = produtosBuscaComInput.length;
    const nomeCategoria = categoriaSelect ? categoriaSelect : 'todas as categorias'

    sumario.innerHTML = await mostrarSumario(produtos.length, totalProdutosCategoria, totalEstoque, totalEstoqueCategoria, nomeCategoria, quant, valorTotalCarrinho);
    containerProdutos.innerHTML = await mostrarProdutos(produtosBuscaComInput, usuarioLogado);
  }

  mostrarProdutosFiltrados();

  selectCategoria.addEventListener('change', mostrarProdutosFiltrados);
  selecPreco.addEventListener('change', mostrarProdutosFiltrados);
  selectOrdenar.addEventListener('change', mostrarProdutosFiltrados);
  inputBusca.addEventListener('input', debounce(mostrarProdutosFiltrados, 250));
  containerProdutos.addEventListener('click', async (e) => {
    const elementoClicado = e.target;

    if(!elementoClicado.classList.contains('btn-ghost')) {
      return
    }

    const card = elementoClicado.closest('.product-card');
    const idProduto = card.id

    console.log(`Id do card clicado ${idProduto}`);

    const itemExistente = carrinho.itens.find(i => Number(i.produtoId) === Number(idProduto));
    if(itemExistente) {
      console.log("O ITEM JÁ EXISTE")
      const resp = await fetch(`${API}/itemCarrinho/${itemExistente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade: itemExistente.quantidade + quantidade })
      });

      if(!resp.ok) return;
    } else {
      console.log("O ITEM NAOOO EXISTE")
      const respItem = await fetch(`${API}/itemCarrinho`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrinhoId: carrinho.id,
          produtoId: idProduto,
          quantidade: quantidade
        })
      });

      if(!respItem.ok) return;
      // carrinho.itens.push({
      //   idProduto,
      //   quantidade
      // })
    }

    const respCarrinho = await fetch(`${API}/carrinhos/${carrinho.id}`);

    if(!respCarrinho) return;

    const carrinhoAtualizado = await respCarrinho.json();

    localStorage.setItem('carrinho', JSON.stringify(carrinhoAtualizado));

    mostrarProdutosFiltrados()

    console.log(carrinho.itens);

    });
}

function debounce(fn, delay) {
  let timer = null;

  return function debounced(...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
