const API = "http://localhost:5039/produtos";

async function carregarProduto() {
    const resposta = await fetch(API);
    const produto = await resposta.json();
    mostrarProduto(produto);
}

function mostrarProduto(produto) {
    const tabela = document.getElementById("tabelaProduto");
    tabela.innerHTML = "";
    produto.forEach(produto => {
    const linha = document.createElement("div");
    
    const real = produto.preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    linha.classList.add("cart-item-wrapper");
      linha.innerHTML = `
        <article class="cart-item">
          <div class="cart-item-info">
            <div class="product-name">${produto.nome}</div>
            <div class="product-code">Id ${produto.id} • Categoria: ${produto.categoria}</div>
            <div class="product-meta">${produto.descricao}</div>
            <span class="badge">${produto.estoque}</span>
          </div>

          <div class="price-col">
            <small>Preço unitário</small>
            <strong>${real}</strong>
          </div>

          <div class="qty-col">
            <div class="qty-label">Quantidade</div>
            <div class="qty-control">
              <button class="qty-btn">−</button>
              <span class="qty-value">${produto.estoque}</span>
              <button class="qty-btn">+</button>
            </div>
          </div>

          <button class="remove-btn" aria-label="Remover item">&times;</button>
        </article>
      `;
      tabela.appendChild(linha);
    });
    atualizarResumo(produto);
  }

function atualizarResumo(produtos) {
    // quantidade de itens
    const qtd = produtos.length;

    document.getElementById("qtdCarrinho").textContent = qtd;
    document.getElementById("qtdProdutosLista").textContent = `${qtd} produtos`;

    // somar valores
    let subtotal = 0;
    produtos.forEach(p => subtotal += p.preco * p.estoque);

    // formatar moeda
    const fmt = subtotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    document.getElementById("subtotalFinal").textContent = fmt;
    document.getElementById("totalFinal").textContent = fmt;
}

  carregarProduto();