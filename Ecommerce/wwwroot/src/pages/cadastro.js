import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

export async function cadastro(root, API) {
    
    root.innerHTML = '';

    root.innerHTML = `
        <div class="main-cadastro">
            <div class="app-shell-cadastro">
                <header class="app-header-cadastro">
                <div>
                    <h1 class="h1-header">Cadastro de cliente</h1>
                    <p class="p-header">Crie sua conta para acompanhar pedidos, salvar endereços e agilizar futuras compras.</p>
                </div>
                <div class="app-header-actions-cadastro">
                    <button class="btn-secondary">Já tenho conta</button>
                </div>
                </header>

                <main>
                <section class="form-card">
                    <div class="form-card-header">
                    <h2>Dados de acesso</h2>
                    <span>Informações obrigatórias</span>
                    </div>

                    <div class="field-group">
                    <div class="field-label">
                        <span>Nome completo</span>
                        <small>Como está no documento</small>
                    </div>
                    <input type="text" placeholder="Digite seu nome completo" />
                    </div>

                    <div class="field-row">
                    <div class="field-group">
                        <div class="field-label">
                        <span>E-mail</span>
                        <small>Usado para login e notificações</small>
                        </div>
                        <input type="email" placeholder="seuemail@exemplo.com" />
                    </div>

                    <div class="field-group">
                        <div class="field-label">
                        <span>Telefone</span>
                        <small>WhatsApp de contato</small>
                        </div>
                        <input type="tel" placeholder="(00) 00000-0000" />
                    </div>
                    </div>

                    <div class="field-group">
                    <div class="field-label">
                        <span>Senha</span>
                        <small>Mínimo de 8 caracteres</small>
                    </div>
                    <input type="password" placeholder="Crie uma senha segura" />
                    <p class="helper-text">
                        Use letras maiúsculas e minúsculas, números e, se desejar, caracteres especiais.
                    </p>
                    </div>
                </section>

                <section class="form-card">
                    <div class="form-card-header">
                    <h2>Endereço principal</h2>
                    <span>Onde você costuma receber pedidos</span>
                    </div>

                    <div class="field-group">
                    <div class="field-label">
                        <span>Endereço</span>
                        <small>Rua, número, complemento</small>
                    </div>
                    <input type="text" placeholder="Ex.: Rua Exemplo, 123 - Apto 45" />
                    <p class="helper-text">
                        Você poderá cadastrar outros endereços depois, se precisar.
                    </p>
                    </div>
                </section>
                </main>

                <footer class="footer-actions" id="actions">
                <div class="footer-actions-left">
                    <button class="btn-outline" id="voltar">Voltar para a loja</button>
                </div>
                <div class="footer-actions-right">
                    <button class="btn-outline btn-outline-strong" id="limpar">Limpar</button>
                    <button class="btn btn-primary" id="salvar">Salvar cadastro</button>
                </div>
                </footer>
            </div>
        </div> 
    `

    handlerActionsCadastro();
}

function handlerActionsCadastro() {
    document.getElementById('actions').addEventListener('click', (e) => {
        const elementoClicado = e.target;

        if(elementoClicado.id === "voltar") {
            setNavegacaoState("home");
            render();
        }
        else if(elementoClicado.id === "limpar") {
            render();
        }
        else if(elementoClicado.id === "salvar") {
            console.log("Realizar cadastro");
        } 
        else {
            return;
        }
    })
}