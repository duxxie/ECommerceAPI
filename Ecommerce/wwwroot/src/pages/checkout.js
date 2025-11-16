import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

export async function checkout(root, API) {
    const API_CARRINHO = `${API}/carrinhos`;
    const API_ITEM_CARRINHO = `${API}/itemCarrinho`;
    const API_FATURA = `${API}/faturas`;

    root.innerHTML = '';

    // Verificar se o usuário está logado
    const userLogado = JSON.parse(localStorage.getItem('userLogado'));
    
    if (!userLogado) {
        root.innerHTML = `
            <div class="app-shell">
                <div class="checkout-vazio" style="text-align: center; padding: 40px;">
                    <h2>Você precisa estar logado para finalizar a compra</h2>
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
    <div id="checkoutBody">
        <div class="app-shell">
            <!-- Cabeçalho -->
            <header class="app-header">
                <div class="app-header-main">
                    <h1>Finalizar Compra</h1>
                    <p>Revise seus dados e escolha a forma de pagamento.</p>
                    <small style="color: var(--text-muted);">Bem-vindo, ${userLogado.nome}!</small>
                </div>
                <div class="app-header-actions">
                    <button class="btn-secondary" id="voltarCarrinho">Voltar ao carrinho</button>
                    <button class="btn-primary" id="finalizarPedido">Finalizar pedido</button>
                </div>
            </header>

            <section class="checkout-wrapper">
                <!-- Dados e Pagamento -->
                <section class="checkout-forms">
                    <!-- Dados de Entrega -->
                    <div class="form-card">
                        <div class="form-card-header">
                            <h2>Endereço de entrega</h2>
                            <span>Onde você quer receber seu pedido</span>
                        </div>

                        <div class="field-group">
                            <div class="field-label">
                                <span>Endereço completo</span>
                            </div>
                            <input id="endereco" type="text" placeholder="Rua, número, complemento, bairro" value="${userLogado.endereco || ''}" />
                        </div>

                        <div class="field-row">
                            <div class="field-group">
                                <div class="field-label">
                                    <span>CEP</span>
                                </div>
                                <input id="cep" type="text" placeholder="00000-000" />
                            </div>

                            <div class="field-group">
                                <div class="field-label">
                                    <span>Cidade</span>
                                </div>
                                <input id="cidade" type="text" placeholder="Sua cidade" />
                            </div>
                        </div>

                        <div class="field-row">
                            <div class="field-group">
                                <div class="field-label">
                                    <span>Estado</span>
                                </div>
                                <input id="estado" type="text" placeholder="UF" />
                            </div>

                            <div class="field-group">
                                <div class="field-label">
                                    <span>Telefone para contato</span>
                                </div>
                                <input id="telefoneContato" type="tel" placeholder="(00) 00000-0000" value="${userLogado.telefone || ''}" />
                            </div>
                        </div>
                    </div>

                    <!-- Método de Pagamento -->
                    <div class="form-card">
                        <div class="form-card-header">
                            <h2>Método de pagamento</h2>
                            <span>Escolha como deseja pagar</span>
                        </div>

                        <div class="payment-methods">
                            <div class="payment-option">
                                <input type="radio" id="pagamentoCartao" name="pagamento" value="1" checked>
                                <label for="pagamentoCartao">
                                    <span class="payment-icon">💳</span>
                                    <span class="payment-text">
                                        <strong>Cartão de Crédito</strong>
                                        <small>Parcelamento em até 12x</small>
                                    </span>
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="pagamentoPix" name="pagamento" value="2">
                                <label for="pagamentoPix">
                                    <span class="payment-icon">🧾</span>
                                    <span class="payment-text">
                                        <strong>PIX</strong>
                                        <small>Pagamento instantâneo</small>
                                    </span>
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="pagamentoBoleto" name="pagamento" value="3">
                                <label for="pagamentoBoleto">
                                    <span class="payment-icon">📄</span>
                                    <span class="payment-text">
                                        <strong>Boleto Bancário</strong>
                                        <small>Pagamento em até 2 dias</small>
                                    </span>
                                </label>
                            </div>

                            <div class="payment-option">
                                <input type="radio" id="pagamentoTransferencia" name="pagamento" value="4">
                                <label for="pagamentoTransferencia">
                                    <span class="payment-icon">🏦</span>
                                    <span class="payment-text">
                                        <strong>Transferência Bancária</strong>
                                        <small>Pagamento via TED/PIX</small>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Campos específicos para cartão -->
                        <div id="dadosCartao" class="payment-details">
                            <div class="field-row">
                                <div class="field-group">
                                    <div class="field-label">
                                        <span>Número do cartão</span>
                                    </div>
                                    <input id="numeroCartao" type="text" placeholder="0000 0000 0000 0000" />
                                </div>
                            </div>

                            <div class="field-row">
                                <div class="field-group">
                                    <div class="field-label">
                                        <span>Nome no cartão</span>
                                    </div>
                                    <input id="nomeCartao" type="text" placeholder="Como está no cartão" />
                                </div>
                            </div>

                            <div class="field-row">
                                <div class="field-group">
                                    <div class="field-label">
                                        <span>Validade</span>
                                    </div>
                                    <input id="validadeCartao" type="text" placeholder="MM/AA" />
                                </div>

                                <div class="field-group">
                                    <div class="field-label">
                                        <span>CVV</span>
                                    </div>
                                    <input id="cvvCartao" type="text" placeholder="000" />
                                </div>

                                <div class="field-group">
                                    <div class="field-label">
                                        <span>Parcelas</span>
                                    </div>
                                    <select id="parcelas">
                                        <option value="1">1x sem juros</option>
                                        <option value="2">2x sem juros</option>
                                        <option value="3">3x sem juros</option>
                                        <option value="4">4x sem juros</option>
                                        <option value="5">5x sem juros</option>
                                        <option value="6">6x sem juros</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Campos para PIX -->
                        <div id="dadosPix" class="payment-details" style="display: none;">
                            <div class="pix-info">
                                <p>Após confirmar o pedido, geraremos um QR Code PIX para pagamento.</p>
                                <small>O pedido será confirmado após a confirmação do pagamento.</small>
                            </div>
                        </div>

                        <!-- Campos para Boleto -->
                        <div id="dadosBoleto" class="payment-details" style="display: none;">
                            <div class="boleto-info">
                                <p>Após confirmar o pedido, geraremos um boleto bancário.</p>
                                <small>O pedido será confirmado após o pagamento do boleto.</small>
                            </div>
                        </div>

                        <!-- Campos para Transferência -->
                        <div id="dadosTransferencia" class="payment-details" style="display: none;">
                            <div class="transferencia-info">
                                <p>Dados para transferência bancária:</p>
                                <div class="bank-details">
                                    <strong>Banco: 341 - ITAÚ</strong><br>
                                    <strong>Agência: 0001</strong><br>
                                    <strong>Conta: 12345-6</strong><br>
                                    <strong>Favorecido: G3E Comércio Eletrônico</strong><br>
                                    <strong>CNPJ: 12.345.678/0001-90</strong>
                                </div>
                                <small>Envie o comprovante para confirmarmos seu pedido.</small>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Resumo do Pedido -->
                <aside class="checkout-summary">
                    <h2>Resumo do pedido</h2>

                    <div class="summary-items" id="resumoItens">
                        <!-- Itens serão carregados aqui -->
                    </div>

                    <div class="summary-totals">
                        <div class="summary-row">
                            <span>Subtotal</span>
                            <strong id="subtotalResumo">R$ 0,00</strong>
                        </div>

                        <div class="summary-row">
                            <span>Frete</span>
                            <strong id="freteResumo">A calcular</strong>
                        </div>

                        <div class="summary-row">
                            <span>Descontos</span>
                            <strong id="descontosResumo">R$ 0,00</strong>
                        </div>

                        <div class="summary-row total">
                            <span>Total</span>
                            <strong id="totalResumo">R$ 0,00</strong>
                        </div>
                    </div>

                    <div class="summary-actions">
                        <button class="btn btn-primary" id="confirmarPedido">Confirmar pedido</button>
                        <button class="btn btn-secondary" id="voltarCarrinhoResumo">Voltar ao carrinho</button>
                    </div>
                </aside>
            </section>
        </div>
    </div>
    `;

    handlerActionsCheckout();
    await carregarDadosCheckout(userLogado.id, API_CARRINHO, API_ITEM_CARRINHO);
}

async function carregarDadosCheckout(userId, API_CARRINHO, API_ITEM_CARRINHO) {
    try {
        console.log("Carregando dados do checkout para usuário:", userId);

        // Busca carrinho do usuário
        const respostaCarrinhos = await fetch(API_CARRINHO);
        const todosCarrinhos = await respostaCarrinhos.json();
        const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === userId);
        
        if (!carrinhosDoUsuario || carrinhosDoUsuario.length === 0) {
            mostrarCheckoutVazio();
            return;
        }

        const carrinho = carrinhosDoUsuario[0];
        
        // Busca itens do carrinho
        const respostaItens = await fetch(API_ITEM_CARRINHO);
        const todosItens = await respostaItens.json();
        const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
        
        if (itensDoCarrinho.length === 0) {
            mostrarCheckoutVazio();
            return;
        }

        await carregarItensCheckout(itensDoCarrinho);
        atualizarResumoCheckout(itensDoCarrinho);

    } catch (erro) {
        console.error("Erro ao carregar dados do checkout:", erro);
        mostrarCheckoutVazio();
    }
}

async function carregarItensCheckout(itensDoCarrinho) {
    const container = document.getElementById('resumoItens');
    
    if (!container) return;

    let html = '';
    let subtotal = 0;

    for (const item of itensDoCarrinho) {
        // Busca dados do produto
        const produto = await buscarProduto(item.produtoId);
        const totalItem = item.precoUnitario * item.quantidade;
        subtotal += totalItem;

        html += `
            <div class="summary-item">
                <div class="item-info">
                    <strong>${produto?.nome || 'Produto não encontrado'}</strong>
                    <small>Quantidade: ${item.quantidade}</small>
                </div>
                <div class="item-price">
                    ${totalItem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    
    // Atualiza totais
    document.getElementById('subtotalResumo').textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('totalResumo').textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

async function buscarProduto(produtoId) {
    try {
        const resposta = await fetch(`http://localhost:5039/produtos/${produtoId}`);
        if (resposta.ok) {
            return await resposta.json();
        }
    } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
    }
    return null;
}

function atualizarResumoCheckout(itensDoCarrinho) {
    const subtotal = itensDoCarrinho.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    
    document.getElementById('subtotalResumo').textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('totalResumo').textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function mostrarCheckoutVazio() {
    const container = document.getElementById('resumoItens');
    if (container) {
        container.innerHTML = `
            <div class="checkout-vazio-message" style="text-align: center; padding: 20px; color: var(--text-muted);">
                <p>Seu carrinho está vazio</p>
                <small>Adicione produtos para finalizar a compra</small>
            </div>
        `;
    }
}

function handlerActionsCheckout() {
    // Navegação
    document.addEventListener('click', (e) => {
        const elementoClicado = e.target;

        switch(elementoClicado.id) {
            case "voltarCarrinho":
            case "voltarCarrinhoResumo":
                setNavegacaoState("carrinho");
                render();
                break;
                
            case "finalizarPedido":
            case "confirmarPedido":
                finalizarPedido();
                break;
        }
    });

    // Mostrar/ocultar campos de pagamento
    document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            ocultarTodosCamposPagamento();
            
            switch(e.target.value) {
                case "1": // Cartão
                    document.getElementById('dadosCartao').style.display = 'block';
                    break;
                case "2": // PIX
                    document.getElementById('dadosPix').style.display = 'block';
                    break;
                case "3": // Boleto
                    document.getElementById('dadosBoleto').style.display = 'block';
                    break;
                case "4": // Transferência
                    document.getElementById('dadosTransferencia').style.display = 'block';
                    break;
            }
        });
    });
}

function ocultarTodosCamposPagamento() {
    document.getElementById('dadosCartao').style.display = 'none';
    document.getElementById('dadosPix').style.display = 'none';
    document.getElementById('dadosBoleto').style.display = 'none';
    document.getElementById('dadosTransferencia').style.display = 'none';
}

async function finalizarPedido() {
    try {
        const userLogado = JSON.parse(localStorage.getItem('userLogado'));
        if (!userLogado) return;

        // Validação básica
        const endereco = document.getElementById('endereco').value;
        const metodoPagamento = document.querySelector('input[name="pagamento"]:checked').value;

        if (!endereco.trim()) {
            alert('Por favor, preencha o endereço de entrega.');
            return;
        }

        if (confirm('Confirmar pedido?')) {
            console.log('=== INICIANDO FINALIZAÇÃO DO PEDIDO ===');
            
            // 1. Buscar carrinho do usuário
            console.log('1. Buscando carrinho...');
            const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
            if (!respostaCarrinhos.ok) {
                throw new Error('Erro ao buscar carrinhos: ' + respostaCarrinhos.status);
            }
            
            const todosCarrinhos = await respostaCarrinhos.json();
            const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === userLogado.id);
            
            if (!carrinhosDoUsuario || carrinhosDoUsuario.length === 0) {
                throw new Error('Carrinho não encontrado.');
            }

            const carrinho = carrinhosDoUsuario[0];
            
            // 2. Buscar itens do carrinho
            console.log('2. Buscando itens do carrinho...');
            const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
            if (!respostaItens.ok) {
                throw new Error('Erro ao buscar itens do carrinho: ' + respostaItens.status);
            }
            
            const todosItens = await respostaItens.json();
            const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
            
            if (itensDoCarrinho.length === 0) {
                throw new Error('Carrinho está vazio.');
            }

            console.log(`Encontrados ${itensDoCarrinho.length} itens no carrinho`);

            // 3. Calcular total do pedido
            const totalPedido = itensDoCarrinho.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
            console.log(`Total do pedido: R$ ${totalPedido}`);

            // 4. Criar o pedido
            console.log('3. Criando pedido...');
            const novoPedido = {
                clienteId: userLogado.id,
                dataPedido: new Date().toISOString(),
                status: 1, // StatusPedido.Criado
                total: totalPedido,
                enderecoEntrega: endereco
            };

            const respostaPedido = await fetch('http://localhost:5039/pedidos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoPedido)
            });

            if (!respostaPedido.ok) {
                throw new Error('Erro ao criar pedido: ' + respostaPedido.status);
            }

            const pedidoCriado = await respostaPedido.json();
            console.log(`✅ Pedido #${pedidoCriado.id} criado com sucesso`);

            // 5. Transferir itens do carrinho para itens do pedido
            console.log('4. Transferindo itens para itemPedidos...');
            let itensTransferidos = 0;
            
            for (const itemCarrinho of itensDoCarrinho) {
                const novoItemPedido = {
                    pedidoId: pedidoCriado.id,
                    produtoId: itemCarrinho.produtoId,
                    quantidade: itemCarrinho.quantidade,
                    precoUnitario: itemCarrinho.precoUnitario
                };

                const respostaItemPedido = await fetch('http://localhost:5039/itemPedidos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoItemPedido)
                });

                if (!respostaItemPedido.ok) {
                    throw new Error('Erro ao criar item do pedido: ' + respostaItemPedido.status);
                }

                itensTransferidos++;
                console.log(`✅ Item ${itensTransferidos}/${itensDoCarrinho.length} transferido`);
            }

            console.log(`✅ Todos os ${itensTransferidos} itens transferidos com sucesso`);

            // 6. Criar fatura
            console.log('5. Criando fatura...');
            const novaFatura = {
                pedidoId: pedidoCriado.id,
                dataEmissao: new Date().toISOString(),
                valorTotal: totalPedido,
                meioPagamento: parseInt(metodoPagamento),
                pago: false
            };

            const respostaFatura = await fetch('http://localhost:5039/faturas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaFatura)
            });

            if (!respostaFatura.ok) {
                throw new Error('Erro ao criar fatura: ' + respostaFatura.status);
            }

            const faturaCriada = await respostaFatura.json();
            console.log(`✅ Fatura #${faturaCriada.id} criada com sucesso`);

            // 7. Limpar carrinho após sucesso (agora tolerante a erros)
            console.log('6. Limpando carrinho...');
            await limparCarrinhoAposPedido(userLogado.id);

            // 8. Feedback para o usuário
            console.log('=== PEDIDO FINALIZADO COM SUCESSO ===');
            alert(`🎉 Pedido #${pedidoCriado.id} confirmado com sucesso!\n\nValor total: R$ ${totalPedido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nEm breve você receberá um e-mail com os detalhes.`);
            
            setNavegacaoState("home");
            render();
        }

    } catch (erro) {
        console.error('❌ ERRO AO FINALIZAR PEDIDO:', erro);
        alert('Erro ao finalizar pedido: ' + erro.message);
    }
}

async function limparCarrinhoAposPedido(userId) {
    try {
        console.log('Limpando carrinho após pedido...');
        
        // Busca carrinho do usuário
        const respostaCarrinhos = await fetch('http://localhost:5039/carrinhos');
        if (!respostaCarrinhos.ok) {
            console.warn('Erro ao buscar carrinhos:', respostaCarrinhos.status);
            return; // Não impede o sucesso do pedido
        }
        
        const todosCarrinhos = await respostaCarrinhos.json();
        const carrinhosDoUsuario = todosCarrinhos.filter(c => c.clienteId === userId);
        
        if (carrinhosDoUsuario.length === 0) {
            console.log('Nenhum carrinho encontrado para limpar');
            return;
        }

        const carrinho = carrinhosDoUsuario[0];
        
        // Busca itens do carrinho
        const respostaItens = await fetch('http://localhost:5039/itemCarrinho');
        if (!respostaItens.ok) {
            console.warn('Erro ao buscar itens do carrinho:', respostaItens.status);
            return; // Não impede o sucesso do pedido
        }
        
        const todosItens = await respostaItens.json();
        const itensDoCarrinho = todosItens.filter(item => item.carrinhoId === carrinho.id);
        
        console.log(`Encontrados ${itensDoCarrinho.length} itens para remover`);

        // Remove todos os itens (com tratamento de erro individual)
        let itensRemovidos = 0;
        let itensComErro = 0;
        
        for (const item of itensDoCarrinho) {
            try {
                const respostaDelete = await fetch(`http://localhost:5039/itemCarrinho/${item.id}`, {
                    method: 'DELETE'
                });
                
                if (respostaDelete.ok) {
                    itensRemovidos++;
                    console.log(`✅ Item ${item.id} removido com sucesso`);
                } else if (respostaDelete.status === 404) {
                    console.log(`ℹ️ Item ${item.id} já não existe (404)`);
                    itensRemovidos++; // Considera como removido se já não existe
                } else {
                    itensComErro++;
                    console.warn(`❌ Erro ao remover item ${item.id}:`, respostaDelete.status);
                }
            } catch (erroItem) {
                itensComErro++;
                console.warn(`❌ Erro ao remover item ${item.id}:`, erroItem.message);
            }
        }
        
        console.log(`Resumo: ${itensRemovidos} itens removidos, ${itensComErro} com erro`);
        
        if (itensComErro > 0) {
            console.warn(`Atenção: ${itensComErro} itens não puderam ser removidos`);
        } else {
            console.log('✅ Carrinho limpo com sucesso');
        }

    } catch (erro) {
        console.error('Erro geral ao limpar carrinho:', erro);
        // Não propaga o erro para não afetar o sucesso do pedido
    }
}