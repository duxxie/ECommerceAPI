import { formatarMoeda } from "../helpers/formatMoeda.js";
import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

// const API = 'http://localhost:5039';

async function mostrarProdutos(produtos, usuarioLogado) {
  console.log(produtos)
  const produtosArrString = produtos.map(produto => 
    `
      <article class="product-card" id="produto-${produto.id}">
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
            <button class="${usuarioLogado ? "btn-ghost" : "btn-ghost btn-disable"}" 
                    data-produto-id="${produto.id}" 
                    data-produto-nome="${produto.nome}"
                    data-produto-preco="${produto.preco}">
              Adicionar ao carrinho
            </button>
        </div>
      </article>
    `
  );

  const produtosString = produtosArrString.join('');
  
  return produtos.length > 0 ? produtosString : `<p>Nenhum produto encontrado...</p>`;
}

async function mostrarSumario(totalProdutos, totalProdutosCategoria, totalEstoque, totalEstoqueCategoria, nomeCategoria) {

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
          <span id="qtdItensCarrinho">0</span>
          <small>itens selecionados</small>
        </div>
        <div class="summary-sub" id="subtotalCarrinho">Subtotal aproximado: R$ 0,00</div>
      </article>
  `;
}

const categorias = ['Notebooks', 'Smartphones', 'Periféricos', 'Acessórios','Áudio', 'Monitores', 'Armazenamento', 'Wearables', 'Tablets', 'Câmeras', 'TVs', 'Redes'];

export async function home(root, produtos) {
  const usuario = JSON.parse(localStorage.getItem('userLogado'));
  const usuarioLogado = usuario !== null;
  
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
              <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M4 20c0-3.5 4-5.5 8-5.5s8 2 8 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
          <span class="span-no-click">${usuarioLogado ? usuario.primeiroNome : 'User'}</span>
        </button>
       
        <button class="btn-cart ${usuarioLogado ? "btn-outline" : "btn-outline btn-disable"}" id="carrinho">
          <span class="icon-cart" aria-hidden="true">🛒</span>
          <span>Carrinho</span>
        </button>
        <button class="${usuarioLogado ? "btn-outline btn-outline-strong" : "btn-outline btn-outline-strong btn-disable"}" id="fim-compra">Finalizar compra</button>
      </div>
    </header>

    <section class="filter-bar">
      <div class="filter-group">
        <label for="categoria">Categoria</label>
        <select id="categoria">
          <option value="">Todas as categorias</option>
          ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
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

    <section class="summary-grid" id="sumario"></section>

    <section id="produtos" class="products-grid" aria-label="Lista de produtos em cards"></section>
  </div>
  `;

  handlerListaProdutos(produtos, usuarioLogado);
  handlerActions();
  await atualizarResumoCarrinho(); // Atualiza o resumo do carrinho na home
}

function handlerActions() {
  document.getElementById('actions').addEventListener('click', (e) => {
    const elementoClicado = e.target;

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
      setNavegacaoState('perfil');
      render();
    }
    else {
      return;
    }
  });
}

async function handlerListaProdutos(produtos, usuarioLogado) {
  const selectCategoria = document.getElementById('categoria');
  const containerProdutos = document.getElementById('produtos');
  const selecPreco = document.getElementById('preco');
  const selectOrdenar = document.getElementById('ordenar');
  const inputBusca = document.getElementById('busca');
  const sumario = document.getElementById('sumario');

  async function mostrarProdutosFiltrados() {
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
    }) : produtosFiltradoCategoria;

    let prod;

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
      prod = produtosFiltradosPreco;
    }

    const produtosBuscaComInput = prod.filter(p => {
      if(inputBusca.value.length < 1) return true;

      const nomeProduto = p.nome.toLowerCase();
      const nomeBusca = inputBusca.value.toLowerCase().trim();
      const numeroIdBusca = Number(nomeBusca);
      
      if(!isNaN(numeroIdBusca)) {
        return numeroIdBusca === p.id;
      } else {
        return nomeProduto.includes(nomeBusca);
      }
    });

    let totalEstoqueCategoria = 0;
    produtosBuscaComInput.forEach(p => {
      totalEstoqueCategoria += p.estoque;
    });

    let totalEstoque = 0;
    produtos.forEach(p => {
      totalEstoque += p.estoque;
    });
    
    const totalProdutosCategoria = produtosBuscaComInput.length;
    const nomeCategoria = categoriaSelect ? categoriaSelect : 'todas as categorias';

    sumario.innerHTML = await mostrarSumario(produtos.length, totalProdutosCategoria, totalEstoque, totalEstoqueCategoria, nomeCategoria);
    containerProdutos.innerHTML = await mostrarProdutos(produtosBuscaComInput, usuarioLogado);
    
    // Adiciona eventos aos botões de adicionar ao carrinho
    if (usuarioLogado) {
      adicionarEventosCarrinho();
    }
  }

  mostrarProdutosFiltrados();

  selectCategoria.addEventListener('change', mostrarProdutosFiltrados);
  selecPreco.addEventListener('change', mostrarProdutosFiltrados);
  selectOrdenar.addEventListener('change', mostrarProdutosFiltrados);
  inputBusca.addEventListener('input', debounce(mostrarProdutosFiltrados, 250));
}

function adicionarEventosCarrinho() {
  const botoesAdicionar = document.querySelectorAll('.btn-ghost[data-produto-id]');
  
  botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', async (e) => {
      const produtoId = e.target.getAttribute('data-produto-id');
      const produtoNome = e.target.getAttribute('data-produto-nome');
      const produtoPreco = parseFloat(e.target.getAttribute('data-produto-preco'));
      
      await adicionarAoCarrinho(produtoId, produtoNome, produtoPreco);
    });
  });
}

async function adicionarAoCarrinho(produtoId, produtoNome, produtoPreco) {
  try {
    const usuario = JSON.parse(localStorage.getItem('userLogado'));
    if (!usuario) {
      alert('Você precisa estar logado para adicionar itens ao carrinho');
      return;
    }

    console.log('=== DEBUG: Iniciando adição ao carrinho ===');
    console.log('Usuário:', usuario);
    console.log('Produto ID:', produtoId, 'Nome:', produtoNome, 'Preço:', produtoPreco);

    // Busca todos os carrinhos
    const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
    
    if (!respostaCarrinhos.ok) {
      throw new Error('Erro ao buscar carrinhos: ' + respostaCarrinhos.status);
    }
    
    const todosCarrinhos = await respostaCarrinhos.json();
    console.log('Todos os carrinhos:', todosCarrinhos);
    
    const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === usuario.id);
    console.log('Carrinhos do usuário:', carrinhosDoUsuario);
    
    let carrinho;
    
    if (carrinhosDoUsuario.length === 0) {
      console.log('Criando novo carrinho...');
      // Cria um novo carrinho se não existir
      const novoCarrinho = {
        clienteId: usuario.id
      };
      
      const respostaCriar = await fetch('http://localhost:5039/carrinhos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCarrinho)
      });
      
      console.log('Resposta criar carrinho:', respostaCriar.status, respostaCriar.statusText);
      
      if (!respostaCriar.ok) {
        throw new Error('Erro ao criar carrinho: ' + respostaCriar.status);
      }
      
      // Verifica se a resposta tem conteúdo antes de fazer .json()
      const responseText = await respostaCriar.text();
      if (responseText) {
        carrinho = JSON.parse(responseText);
      } else {
        // Se a resposta está vazia, busca o carrinho recém-criado
        const respostaCarrinhosAtualizado = await fetch('http://localhost:5039/carrinhos');
        const carrinhosAtualizados = await respostaCarrinhosAtualizado.json();
        carrinho = carrinhosAtualizados.find(c => c.clienteId === usuario.id);
      }
      
      console.log('Novo carrinho criado:', carrinho);
    } else {
      carrinho = carrinhosDoUsuario[0];
      console.log('Carrinho existente:', carrinho);
    }

    // Busca itens existentes no carrinho - CORREÇÃO: endpoint singular
    const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
    
    if (!respostaItens.ok) {
      throw new Error('Erro ao buscar itens: ' + respostaItens.status);
    }
    
    const todosItens = await respostaItens.json();
    const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
    console.log('Itens do carrinho:', itensDoCarrinho);

    const produtoIdInt = parseInt(produtoId);
    
    // Verifica se o produto já está no carrinho
    const itemExistente = itensDoCarrinho.find(item => item.produtoId === produtoIdInt);
    
    if (itemExistente) {
      console.log('Atualizando quantidade do item existente...');
      // Atualiza a quantidade se o produto já existe
      const itemAtualizado = {
        ...itemExistente,
        quantidade: itemExistente.quantidade + 1
      };

      console.log('Enviando PUT para:', `http://localhost:5039/itemCarrinho/${itemExistente.id}`);
      console.log('Dados:', itemAtualizado);

      const respostaUpdate = await fetch(`http://localhost:5039/itemCarrinho/${itemExistente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemAtualizado)
      });
      
      console.log('Resposta PUT:', respostaUpdate.status, respostaUpdate.statusText);
      
      if (!respostaUpdate.ok) {
        throw new Error('Erro ao atualizar item: ' + respostaUpdate.status);
      }

      // Verifica se a resposta tem conteúdo
      const updateText = await respostaUpdate.text();
      if (updateText) {
        console.log('Resposta PUT com conteúdo:', updateText);
      }

    } else {
      console.log('Adicionando novo item...');
      // Adiciona novo item ao carrinho
      const novoItem = {
        carrinhoId: carrinho.id,
        produtoId: produtoIdInt,
        quantidade: 1,
        precoUnitario: produtoPreco
      };

      console.log('Enviando POST para:', `http://localhost:5039/itemCarrinho`);
      console.log('Dados:', novoItem);

      const respostaAdd = await fetch(`http://localhost:5039/itemCarrinho`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem)
      });
      
      console.log('Resposta POST:', respostaAdd.status, respostaAdd.statusText);
      
      if (!respostaAdd.ok) {
        throw new Error('Erro ao adicionar item: ' + respostaAdd.status);
      }

      // Verifica se a resposta tem conteúdo
      const addText = await respostaAdd.text();
      if (addText) {
        console.log('Resposta POST com conteúdo:', addText);
      }
    }

    // Feedback visual
    const botao = document.querySelector(`[data-produto-id="${produtoId}"]`);
    if (botao) {
      const textoOriginal = botao.textContent;
      botao.textContent = '✓ Adicionado!';
      botao.style.backgroundColor = '#dcfce7';
      botao.style.color = '#15803d';
      
      setTimeout(() => {
        botao.textContent = textoOriginal;
        botao.style.backgroundColor = '';
        botao.style.color = '';
      }, 2000);
    }

    // Atualiza o resumo do carrinho na home
    await atualizarResumoCarrinho();
    
    console.log('=== DEBUG: Adição concluída com sucesso ===');
    
  } catch (erro) {
    console.error('=== DEBUG: Erro ao adicionar ao carrinho ===', erro);
    alert('Erro ao adicionar produto ao carrinho: ' + erro.message);
  }
}

async function atualizarResumoCarrinho() {
  try {
    const usuario = JSON.parse(localStorage.getItem('userLogado'));
    if (!usuario) return;

    // Busca carrinho do usuário
    const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
    const todosCarrinhos = await respostaCarrinhos.json();
    const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === usuario.id);
    
    if (carrinhosDoUsuario.length > 0) {
      const carrinho = carrinhosDoUsuario[0];
      
      // Busca itens do carrinho - CORREÇÃO: endpoint singular
      const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
      const todosItens = await respostaItens.json();
      const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
      
      // Calcula totais manualmente
      const qtdItens = itensDoCarrinho.reduce((total, item) => total + item.quantidade, 0);
      const subtotal = itensDoCarrinho.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
      
      const qtdElement = document.getElementById('qtdItensCarrinho');
      const subtotalElement = document.getElementById('subtotalCarrinho');
      
      if (qtdElement) qtdElement.textContent = qtdItens;
      if (subtotalElement) subtotalElement.textContent = `Subtotal aproximado: ${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    }
  } catch (erro) {
    console.error('Erro ao atualizar resumo do carrinho:', erro);
  }
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




