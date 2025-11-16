import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

export async function carrinho(root, API) {
    const API_CARRINHO = `${API}/carrinhos`;
    const API_PRODUTO = `${API}/produtos`;

    root.innerHTML = '';

    // Verificar se o usuário está logado
    const userLogado = JSON.parse(localStorage.getItem('userLogado'));
    
    if (!userLogado) {
        root.innerHTML = `
            <div class="app-shell">
                <div class="carrinho-vazio" style="text-align: center; padding: 40px;">
                    <h2>Você precisa estar logado para ver o carrinho</h2>
                    <p>Faça login ou crie uma conta para continuar.</p>
                    <div class="summary-actions" style="margin-top: 20px;">
                        <button class="btn btn-primary" id="fazerLogin">Fazer Login</button>
                        <button class="btn btn-secondary" id="criarConta">Criar Conta</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('fazerLogin').addEventListener('click', () => {
            setNavegacaoState('login');
            render();
        });
        
        document.getElementById('criarConta').addEventListener('click', () => {
            setNavegacaoState('cadastro');
            render();
        });
        
        return;
    }

    root.innerHTML = `
    <div id="carrinhoBody">
        <div class="app-shell">
            <!-- Cabeçalho -->
            <header class="app-header">
                <div class="app-header-main">
                    <h1>Carrinho de compras</h1>
                    <p>Revise os itens selecionados antes de finalizar o pedido.</p>
                    <small style="color: var(--text-muted);">Bem-vindo, ${userLogado.nome}!</small>
                </div>
                <div class="app-header-actions">
                    <button class="btn-secondary" id="continuarComprandoHeader">Continuar comprando</button>
                    <button class="btn-primary" id="finalizarCompraHeader">Finalizar compra</button>
                </div>
            </header>

            <!-- Resumo superior -->
            <section class="summary-grid">
                <article class="summary-card">
                    <div class="summary-title">Itens no carrinho</div>
                    <div class="summary-main">
                        <span id="qtdCarrinho">0</span>
                        <small>produtos selecionados</small>
                    </div>
                </article>

                <article class="summary-card">
                    <div class="summary-title">Subtotal</div>
                    <div class="summary-main">
                        <span id="subtotalResumo">R$ 0,00</span>
                    </div>
                    <div class="summary-sub">valor sem frete e descontos</div>
                </article>

                <article class="summary-card">
                    <div class="summary-title">Usuário</div>
                    <div class="summary-main">
                        <span>${userLogado.nome.split(' ')[0]}</span>
                        <small>logado</small>
                    </div>
                    <div class="summary-sub">${userLogado.email}</div>
                </article>
            </section>

            <section class="cart-wrapper">
                <!-- Itens -->
                <section class="cart-items" aria-label="Itens do carrinho">
                    <div class="cart-items-header">
                        <h2>Itens selecionados</h2>
                        <span id="qtdProdutosLista">0 produtos</span>
                    </div>
                    <div id="tabelaitemCarrinho"></div>
                </section>

                <!-- Resumo do pedido -->
                <aside class="cart-summary" aria-label="Resumo do pedido">
                    <h2>Resumo do pedido</h2>

                    <div class="summary-row">
                        <span>Subtotal dos produtos</span>
                        <strong id="subtotalFinal">R$ 0,00</strong>
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
                        <strong id="totalFinal">R$ 0,00</strong>
                    </div>

                    <p class="summary-note">
                        O valor final será confirmado após o cálculo do frete e aplicação de cupons de desconto.
                    </p>

                    <div class="summary-actions">
                        <button class="btn btn-primary" id="finalizarCompraResumo">Finalizar compra</button>
                        <button class="btn btn-secondary" id="continuarComprandoResumo">Continuar comprando</button>
                    </div>
                </aside>
            </section>

            <!-- Rodapé -->
            <footer class="footer-actions">
                <div class="footer-actions-left">
                    <button class="btn-outline" id="limparCarrinho">Limpar carrinho</button>
                    <button class="btn-outline" id="sairConta">Sair da conta</button>
                </div>
                <div class="footer-actions-right">
                    <button class="btn-outline" id="voltarProdutos">Voltar à lista de produtos</button>
                    <button class="btn-outline btn-outline-strong" id="irPagamento">Ir para pagamento</button>
                </div>
            </footer>
        </div>
    </div>
    `;

    handlerActionsCarrinho();
    
    // Agora busca o carrinho do usuário logado
    await carregarCarrinhoDoUsuario(userLogado.id, API_CARRINHO, API_PRODUTO);
}

async function carregarCarrinhoDoUsuario(userId, API_CARRINHO, API_PRODUTO) {
  try {
    console.log("Buscando carrinho para usuário ID:", userId);
    
    // Busca TODOS os carrinhos
    const respCarrinhos = await fetch(API_CARRINHO);
    
    if (!respCarrinhos.ok) {
      console.error("Erro ao buscar carrinhos:", respCarrinhos.status);
      mostrarCarrinhoVazio();
      return;
    }

    const todosCarrinhos = await respCarrinhos.json();
    console.log("Todos os carrinhos:", todosCarrinhos);
    
    // Filtra carrinhos pelo clienteId
    const carrinhosDoUsuario = todosCarrinhos.filter(carrinho => carrinho.clienteId === userId);
    console.log("Carrinhos do usuário:", carrinhosDoUsuario);
    
    // Se não encontrou carrinho para o usuário
    if (!carrinhosDoUsuario || carrinhosDoUsuario.length === 0) {
      console.log("Nenhum carrinho encontrado para o usuário");
      mostrarCarrinhoVazio();
      return;
    }

    // Pega o primeiro carrinho do usuário
    const carrinho = carrinhosDoUsuario[0];
    console.log("Carrinho selecionado:", carrinho);
    
    // Busca itens do carrinho - CORREÇÃO: endpoint singular
    const respItens = await fetch(`http://localhost:5039/itemCarrinho`);
    
    if (!respItens.ok) {
      console.error("Erro ao buscar itens:", respItens.status);
      mostrarCarrinhoVazio();
      return;
    }
    
    const todosItens = await respItens.json();
    const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
    console.log("Itens do carrinho:", itensDoCarrinho);
    
    await carregarItensCarrinho(carrinho, itensDoCarrinho, API_PRODUTO);

  } catch (erro) {
    console.error("Erro de conexão:", erro);
    mostrarCarrinhoVazio();
  }
}

async function carregarItensCarrinho(carrinho, itensDoCarrinho, API_PRODUTO) {
  console.log("Carregando itens do carrinho:", itensDoCarrinho);
  
  // Verifica se existem itens no carrinho
  if (!itensDoCarrinho || itensDoCarrinho.length === 0) {
    console.log("Carrinho não tem itens");
    mostrarCarrinhoVazio();
    return;
  }

  try {
    // Buscar produtos relacionados para cada item
    const itensCompletos = await Promise.all(
      itensDoCarrinho.map(async (item) => {
        console.log("Buscando produto ID:", item.produtoId);
        const respProduto = await fetch(`${API_PRODUTO}/${item.produtoId}`);
        
        if (respProduto.ok) {
          const produto = await respProduto.json();
          console.log("Produto encontrado:", produto);
          return {
            ...item,
            produto
          };
        } else {
          console.log("Produto não encontrado para ID:", item.produtoId);
          return {
            ...item,
            produto: null
          };
        }
      })
    );

    console.log("Itens completos:", itensCompletos);
    mostrarItensCarrinho(itensCompletos);
    atualizarResumo(carrinho, itensCompletos);

  } catch (erro) {
    console.error("Erro ao carregar itens:", erro);
    mostrarCarrinhoVazio();
  }
}

function mostrarCarrinhoVazio() {
    const tabela = document.getElementById("tabelaitemCarrinho");
    if (tabela) {
        tabela.innerHTML = `
            <div class="carrinho-vazio-message" style="text-align: center; padding: 40px; color: var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 8px;">Seu carrinho está vazio</p>
                <small>Adicione produtos para continuar</small>
            </div>
        `;
    }
    
    // Atualiza os resumos para zero
    document.getElementById("qtdCarrinho").textContent = "0";
    document.getElementById("qtdProdutosLista").textContent = "0 produtos";
    document.getElementById("subtotalResumo").textContent = "R$ 0,00";
    document.getElementById("subtotalFinal").textContent = "R$ 0,00";
    document.getElementById("totalFinal").textContent = "R$ 0,00";
}

function mostrarItensCarrinho(itens) {
    const tabela = document.getElementById("tabelaitemCarrinho");

    if (!tabela) {
        console.error("Elemento #tabelaitemCarrinho não encontrado!");
        return;
    }

    tabela.innerHTML = "";

    if (itens.length === 0) {
        mostrarCarrinhoVazio();
        return;
    }

    console.log("Mostrando", itens.length, "itens no carrinho");

    itens.forEach(item => {
        const produto = item.produto ?? {};

        const precoUnit = item.precoUnitario.toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        });

        const linha = document.createElement("div");

        linha.innerHTML = `
        <article class="cart-item" data-item-id="${item.id}">
            <div class="cart-item-info">
                <div class="product-name">${produto.nome ?? "Produto não encontrado"}</div>
                <div class="product-code">Item ID: ${item.id} • Produto ID: ${item.produtoId}</div>
                <div class="product-meta">${produto.descricao ?? ""}</div>
                <span class="badge">${produto.categoria ?? "Sem categoria"}</span>
            </div>

            <div class="price-col">
                <small>Preço unitário</small>
                <strong>${precoUnit}</strong>
            </div>

            <div class="qty-col">
                <div class="qty-label">Quantidade</div>
                <div class="qty-control">
                    <button class="qty-btn minus-btn" data-item-id="${item.id}">−</button>
                    <span class="qty-value" data-item-id="${item.id}">${item.quantidade}</span>
                    <button class="qty-btn plus-btn" data-item-id="${item.id}">+</button>
                </div>
            </div>

            <button class="remove-btn" data-item-id="${item.id}">&times;</button>
        </article>
        `;

        tabela.appendChild(linha);
    });

    // Adiciona eventos aos botões
    adicionarEventosItensCarrinho();
}

function atualizarResumo(carrinho, itens) {
    console.log("Atualizando resumo com carrinho:", carrinho);
    console.log("Itens para calcular:", itens);
    
    // Calcula totais baseado nos itens (não confia no carrinho.total que pode estar desatualizado)
    const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
    const total = itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    
    console.log("Total calculado:", total, "Quantidade total:", totalItens);

    document.getElementById("qtdCarrinho").textContent = totalItens;
    document.getElementById("qtdProdutosLista").textContent = `${totalItens} produtos`;

    const totalFmt = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    document.getElementById("subtotalResumo").textContent = totalFmt;
    document.getElementById("subtotalFinal").textContent = totalFmt;
    document.getElementById("totalFinal").textContent = totalFmt;
    
    console.log("Resumo atualizado com sucesso");
}

function handlerActionsCarrinho() {
    document.addEventListener('click', (e) => {
        const elementoClicado = e.target;

        switch(elementoClicado.id) {
            case "continuarComprandoHeader":
            case "continuarComprandoResumo":
            case "voltarProdutos":
                setNavegacaoState("home");
                render();
                break;
                
            case "finalizarCompraHeader":
            case "finalizarCompraResumo":
            case "irPagamento":
                alert("Funcionalidade de pagamento em desenvolvimento!");
                break;
                
            case "limparCarrinho":
                if(confirm("Tem certeza que deseja limpar o carrinho?")) {
                    limparCarrinho();
                }
                break;
                
            case "sairConta":
                if(confirm("Deseja sair da sua conta?")) {
                    localStorage.removeItem('userLogado');
                    setNavegacaoState("home");
                    render();
                }
                break;
        }
    });
}

async function limparCarrinho() {
    try {
        if (!confirm("Tem certeza que deseja limpar todo o carrinho?")) {
            return;
        }

        const userLogado = JSON.parse(localStorage.getItem('userLogado'));
        if (!userLogado) return;

        // Busca carrinho do usuário
        const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
        const todosCarrinhos = await respostaCarrinhos.json();
        const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === userLogado.id);
        
        if (carrinhosDoUsuario.length > 0) {
            const carrinho = carrinhosDoUsuario[0];
            
            // Busca itens do carrinho
            const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
            const todosItens = await respostaItens.json();
            const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
            
            // Remove todos os itens
            for (const item of itensDoCarrinho) {
                await fetch(`http://localhost:5039/itemCarrinho/${item.id}`, {
                    method: 'DELETE'
                });
            }
            
            alert("Carrinho limpo com sucesso!");
            // Recarrega a página do carrinho
            setNavegacaoState("carrinho");
            render();
        }
        
    } catch (erro) {
        console.error("Erro ao limpar carrinho:", erro);
        alert("Erro ao limpar carrinho");
    }
}

// Estas funções devem estar no carrinho.js, não no home.js
function adicionarEventosItensCarrinho() {
    // Botões de aumentar quantidade
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            atualizarQuantidadeItem(itemId, 1);
        });
    });

    // Botões de diminuir quantidade
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            atualizarQuantidadeItem(itemId, -1);
        });
    });

    // Botões de remover item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-item-id');
            removerItem(itemId);
        });
    });
}

async function atualizarQuantidadeItem(itemId, mudanca) {
    try {
        console.log('Atualizando quantidade do item:', itemId, 'Mudança:', mudanca);

        // Busca o item atual
        const respostaItem = await fetch(`http://localhost:5039/itemCarrinho/${itemId}`);
        if (!respostaItem.ok) {
            throw new Error('Erro ao buscar item: ' + respostaItem.status);
        }

        const item = await respostaItem.json();
        console.log('Item atual:', item);

        // Calcula nova quantidade
        const novaQuantidade = item.quantidade + mudanca;

        // Se quantidade for 0 ou menos, remove o item
        if (novaQuantidade <= 0) {
            await removerItem(itemId);
            return;
        }

        // Atualiza o item
        const itemAtualizado = {
            ...item,
            quantidade: novaQuantidade
        };

        const respostaUpdate = await fetch(`http://localhost:5039/itemCarrinho/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemAtualizado)
        });

        if (!respostaUpdate.ok) {
            throw new Error('Erro ao atualizar item: ' + respostaUpdate.status);
        }

        console.log('Item atualizado com sucesso');

        // Atualiza a interface
        await atualizarInterfaceItem(itemId, novaQuantidade, item.precoUnitario);

    } catch (erro) {
        console.error('Erro ao atualizar quantidade:', erro);
        alert('Erro ao atualizar quantidade: ' + erro.message);
    }
}

async function removerItem(itemId) {
    try {
        if (!confirm('Tem certeza que deseja remover este item do carrinho?')) {
            return;
        }

        console.log('Removendo item:', itemId);

        const respostaDelete = await fetch(`http://localhost:5039/itemCarrinho/${itemId}`, {
            method: 'DELETE'
        });

        if (!respostaDelete.ok) {
            throw new Error('Erro ao remover item: ' + respostaDelete.status);
        }

        console.log('Item removido com sucesso');

        // Remove o item da interface
        const elementoItem = document.querySelector(`[data-item-id="${itemId}"]`);
        if (elementoItem) {
            elementoItem.remove();
        }

        // Recarrega o carrinho para atualizar totais
        const userLogado = JSON.parse(localStorage.getItem('userLogado'));
        if (userLogado) {
            await carregarCarrinhoDoUsuario(userLogado.id, 'http://localhost:5039/carrinhos', 'http://localhost:5039/produtos');
        }

    } catch (erro) {
        console.error('Erro ao remover item:', erro);
        alert('Erro ao remover item: ' + erro.message);
    }
}

async function atualizarInterfaceItem(itemId, novaQuantidade, precoUnitario) {
    // Atualiza a quantidade
    const elementoQuantidade = document.querySelector(`.qty-value[data-item-id="${itemId}"]`);
    if (elementoQuantidade) {
        elementoQuantidade.textContent = novaQuantidade;
    }

    // Atualiza o total do item
    const elementoTotal = document.querySelector(`.item-total[data-item-id="${itemId}"]`);
    if (elementoTotal) {
        const totalItem = (precoUnitario * novaQuantidade).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        });
        elementoTotal.textContent = totalItem;
    }

    // Recarrega os totais do carrinho
    const userLogado = JSON.parse(localStorage.getItem('userLogado'));
    if (userLogado) {
        await atualizarTotaisCarrinho(userLogado.id);
    }
}

async function atualizarTotaisCarrinho(userId) {
    try {
        // Busca carrinho atualizado
        const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
        const todosCarrinhos = await respostaCarrinhos.json();
        const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === userId);
        
        if (carrinhosDoUsuario.length > 0) {
            const carrinho = carrinhosDoUsuario[0];
            
            // Busca itens atualizados
            const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
            const todosItens = await respostaItens.json();
            const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
            
            // Atualiza resumo
            atualizarResumo(carrinho, itensDoCarrinho);
        }
    } catch (erro) {
        console.error('Erro ao atualizar totais:', erro);
    }
}