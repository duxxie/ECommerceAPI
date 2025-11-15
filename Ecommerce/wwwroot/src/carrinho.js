const API_CARRINHO = "http://localhost:5039/carrinhos";
const API_PRODUTO = "http://localhost:5039/produtos";

async function carregarCarrinho(idCarrinho) {
    try {
        const resp = await fetch(`${API_CARRINHO}/${idCarrinho}`);

        if (!resp.ok) {
            console.error("Erro ao buscar carrinho:", resp.status);
            return;
        }

        const carrinho = await resp.json();

        // Buscar produtos relacionados
        const itensCompletos = await Promise.all(
            carrinho.itens.map(async (item) => {
                const respProduto = await fetch(`${API_PRODUTO}/${item.produtoId}`);
                const produto = respProduto.ok ? await respProduto.json() : null;

                return {
                    ...item,
                    produto
                };
            })
        );

        mostrarItensCarrinho(itensCompletos);
        atualizarResumo(carrinho, itensCompletos);

    } catch (erro) {
        console.error("Erro de conexão:", erro);
    }
}

function mostrarItensCarrinho(itens) {
    const tabela = document.getElementById("tabelaitemCarrinho");

    if (!tabela) {
        console.error("Elemento #tabelaitemCarrinho não encontrado!");
        return;
    }

    tabela.innerHTML = "";

    itens.forEach(item => {
        const produto = item.produto ?? {};

        const precoUnit = item.precoUnitario.toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        });

        const linha = document.createElement("div");

        linha.innerHTML = `
        <article class="cart-item">
            <div class="cart-item-info">
                <div class="product-name">${produto.nome ?? "Produto não encontrado"}</div>
                <div class="product-code">Id ${item.id} • ProdutoId: ${item.produtoId}</div>
                <div class="product-meta">${produto.descricao ?? ""}</div>
                <span class="badge">${produto.categoria ?? ""}</span>
            </div>

            <div class="price-col">
                <small>Preço unitário</small>
                <strong>${precoUnit}</strong>
            </div>

            <div class="qty-col">
                <div class="qty-label">Quantidade</div>
                <div class="qty-control">
                    <button class="qty-btn">−</button>
                    <span class="qty-value">${item.quantidade}</span>
                    <button class="qty-btn">+</button>
                </div>
            </div>

            <button class="remove-btn">&times;</button>
        </article>
        `;

        tabela.appendChild(linha);
    });
}

function atualizarResumo(carrinho, itens) {

    document.getElementById("qtdCarrinho").textContent = itens.length;
    document.getElementById("qtdProdutosLista").textContent = `${itens.length} produtos`;

    let total = 0;
    itens.forEach(item => total += item.precoUnitario * item.quantidade);

    const totalFmt = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    document.getElementById("subtotalFinal").textContent = totalFmt;
    document.getElementById("totalFinal").textContent = totalFmt;
}

// Carregar automaticamente o carrinho ID=17
carregarCarrinho(17);
