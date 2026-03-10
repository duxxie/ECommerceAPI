import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

export function login(root, API) {
    root.innerHTML = ''

    root.innerHTML = `
        <div class="main-login">
            <div class="app-shell-login">
                <header class="app-header-login">
                    <h1 class="h1-header">Entrar na sua conta</h1>
                    <p class="p-header">Acesse para acompanhar seus pedidos e continuar suas compras.</p>
                </header>
                <main>
                    <section class="form-card">
                        <div class="form-card-header">
                            <h2>Login do cliente</h2>
                        </div>

                        <div class="field-group">
                            <div class="field-label">
                                <span>E-mail</span>
                                <small>O mesmo utilizado no cadastro</small>
                            </div>
                            <input id="email" type="email" placeholder="seuemail@exemplo.com" />
                        </div>

                        <div class="field-group">
                            <div class="field-label">
                                <span>Senha</span>
                                <small>Mínimo de 8 caracteres</small>
                            </div>
                            <input id="senha" type="password" placeholder="Digite sua senha" />
                            <div class="helper-row">
                            </div>
                        </div>

                        <div id="msg-erro" class="caixa-erro">
                        </div>
                        <div id="opcoes"> 
                            <button class="btn btn-primary primary-max-width" id="entrar">Entrar</button>
                            <button class="btn btn-secondary secondary-max-width" id="voltar">Voltar para a loja</button>
                        </div>

                        <p class="form-footer-text">
                        Ainda não tem cadastro?
                        <a id="criar-conta">Criar nova conta</a>
                        </p>
                    </section>
                </main>
            </div>
        </div>
    `
    handlerOpcoes(API);
}

function handlerOpcoes(API) {
    document.getElementById('opcoes').addEventListener('click', async (e) => {
        const elementoClicado = e.target
        const caixaMsgErro = document.getElementById('msg-erro');
    
        if(elementoClicado.id === "entrar") {
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value.trim();

            if(!email || !senha) {
                caixaMsgErro.innerHTML = `
                    <div class="msg-erro">
                    ${mensagemErro("E-mail ou senha inválidos.")}
                    </div>
                `
                return;
            }
            console.log(`Tamanho senha => ${senha.length}`)
            if(senha.length < 8) {
                caixaMsgErro.innerHTML = `
                    <div class="msg-erro">
                    ${mensagemErro("E-mail ou senha inválidos.")}
                    </div>
                `
                return
            }
            const resposta = await fetch(`${API}/login`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({email, senha})
            });

            if(!resposta.ok) {
                console.log("Entrou no erro do ok")
                 caixaMsgErro.innerHTML = `
                    <div class="msg-erro">
                    ${mensagemErro("E-mail ou senha inválidos.")}
                    </div>
                `
                return
            }
            
            const clienteLogado = await resposta.json();

            localStorage.setItem('userLogado', JSON.stringify(clienteLogado));

            setNavegacaoState('home');
            render();
        }
        else if( elementoClicado.id === "voltar") {
            setNavegacaoState("home");
            render()
        }
        else {
            return
        }
    });

    document.getElementById('criar-conta').addEventListener('click', () => {
        setNavegacaoState("cadastro");
        render();
    })
}

function mensagemErro(mensagem) {
    return `⚠️ ${mensagem}`;
}