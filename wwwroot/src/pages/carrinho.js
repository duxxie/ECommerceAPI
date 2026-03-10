import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js"
import { formatarMoeda } from "../helpers/formatMoeda.js";
import { API } from "../main.js";

function carregarCarrinhoLocalStorage() {
  const str = localStorage.getItem('carrinho');
  return str ? JSON.parse(str) : null;
}

function salvarCarrinhoLocalStorage(carrinho) {
    localStorage.setItem('carrinho' , JSON.stringify(carrinho));
}

async function carregarCarrinho() {
    const carrinhoLocal = carregarCarrinhoLocalStorage()
    const respCarrinho = await fetch(`${API}/carrinhos/${carrinhoLocal.id}`);

    if(!respCarrinho) 
        return null
    
    const carrinhoAtualizado = await respCarrinho.json();

    salvarCarrinhoLocalStorage(carrinhoAtualizado);   
}

function mostrarSumarioCarrinho(elemento, totalEstoqueCarrinho, valorTotalCarrinho, itensCarrinho) {

    elemento.innerHTML = ''

    elemento.innerHTML = `
        <article class="summary-card-carrinho">
        <div class="summary-title-carrinho">Itens no carrinho</div>
        <div class="summary-main-carrinho">
          <span>${totalEstoqueCarrinho}</span>
          <small>produtos selecionados</small>
        </div>
        <div class="summary-sub-carrinho">você pode adicionar ou remover itens a qualquer momento</div>
      </article>

      <article class="summary-card-carrinho">
        <div class="summary-title-carrinho">Subtotal</div>
        <div class="summary-main-carrinho">
          <span>${formatarMoeda(valorTotalCarrinho)}</span>
        </div>
        <div class="summary-sub-carrinho">valor sem frete e descontos</div>
      </article>

      <article class="summary-card-carrinho">
        <div class="summary-title-carrinho">Estoque</div>
        <div class="summary-main-carrinho">
          <span>${itensCarrinho}</span>
          <small>itens confirmados</small>
        </div>
        <div class="summary-sub-carrinho">todos os produtos estão disponíveis para envio imediato</div>
      </article>
    `
}

export function carrinho(root, produtos) {

    carregarCarrinho();

    root.innerHTML = '';

    root.innerHTML = `
    <div class="app-shell-carrinho">
   
    <header class="app-header-carrinho">
      <div class="app-header-main-carrinho">
        <h1>Carrinho de compras</h1>
        <p>Revise os itens selecionados antes de finalizar o pedido.</p>
      </div>
    </header>

    <section class="summary-grid-carrinho" id="sumario">
      
    </section>

    <section class="cart-wrapper">
     
      <section class="cart-items" id="itens" aria-label="Itens do carrinho">
        
      </section>

     
      <aside class="cart-summary" aria-label="Resumo do pedido">
        <h2>Resumo do pedido</h2>

        <div class="summary-row">
          <span>Subtotal dos produtos</span>
          <strong>R$ 4.320,00</strong>
        </div>

        <div class="summary-row">
          <span>Frete</span>
          <strong>A calcular</strong>
        </div>

        <div class="summary-row">
          <span>Descontos</span>
          <strong>R$ 0,00</strong>
        </div>

        <div class="summary-row total">
          <span>Total estimado</span>
          <strong>R$ 4.320,00</strong>
        </div>

        <p class="summary-note">
          O valor final será confirmado após o cálculo do frete e aplicação de cupons de desconto.
        </p>

        <div class="summary-actions">
          <button class="btn btn-primary">Finalizar compra</button>
          <button class="btn btn-secondary">Continuar comprando</button>
        </div>
      </aside>
    </section>

    
    <footer class="footer-actions">
      <div class="footer-actions-left">
        <button class="btn-outline">Limpar carrinho</button>
      </div>
      <div class="footer-actions-right">
        <button class="btn-outline" id="voltar">Voltar à lista de produtos</button>
        <button class="btn-outline btn-outline-strong">Ir para pagamento</button>
      </div>
    </footer>
  </div>
    `
    handlerActionsCarrinho(produtos)
    handlerActionsFooter()
}

function mostrarProdutos(elemento, itens, produtos) {

    const arrString = itens.map(item => { 
        const produto = produtos.find(p => Number(p.id) === Number(item.produtoId));
        if(!produto) return;

        const produtoElemento = `
            <article class="cart-item">
          <div class="cart-item-info">
            <div class="product-name">${produto.nome}</div>
            <div class="product-code">Código: ${produto.id} • Categoria: ${produto.categoria}</div>
            <div class="product-meta">${produto.descricao}</div>
            <span class="badge">Em estoque</span>
          </div>

          <div class="price-col">
            <small>Preço unitário</small>
            <strong>${formatarMoeda(produto.preco)}</strong>
          </div>

          <div class="qty-col">
            <div class="qty-label">Quantidade</div>
            <div class="qty-control">
              <button class="qty-btn">−</button>
              <span class="qty-value">${item.quantidade}</span>
              <button class="qty-btn">+</button>
            </div>
          </div>

          <button class="remove-btn" aria-label="Remover item">&times;</button>
        </article>
        `
        return produtoElemento;
    })

     const itensString = arrString.join('');

    elemento.innerHTML = `
        <div class="cart-items-header">
          <h2>Itens selecionados</h2>
          <span>7 produtos</span>
        </div>
        ${itensString}
    `
}

function handlerActionsCarrinho(produtos) {
    const carrinho = carregarCarrinhoLocalStorage()
    const elementoItens = document.getElementById('itens')
    const elementoSumarios = document.getElementById('sumario')
    const itensCarrinho = carrinho.itens.length

    let valorTotalCarrinho = 0;
    let quant = 0
    
      carrinho.itens.forEach(item => {
      quant += item.quantidade

      const produto = produtos.find(p => Number(p.id) === Number(item.produtoId));
      console.log(produto)
      if(!produto) return;

      const preco = produto.preco;

      const subtotal = preco * item.quantidade;
      valorTotalCarrinho += subtotal;
      
    });
    
    mostrarProdutos(elementoItens, carrinho.itens, produtos)
    mostrarSumarioCarrinho(elementoSumarios, quant, valorTotalCarrinho, carrinho.itens.length)
}

function handlerActionsFooter() {
    document.getElementById('voltar').addEventListener('click', () => {
        setNavegacaoState('home')
        render();
    })
}