import { setNavegacaoState } from "../helpers/stateNavegacao.js";
import { render } from "../main.js";

export function login(root) {
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
                            <input type="email" placeholder="seuemail@exemplo.com" />
                        </div>

                        <div class="field-group">
                            <div class="field-label">
                                <span>Senha</span>
                                <small>Mínimo de 8 caracteres</small>
                            </div>
                            <input type="password" placeholder="Digite sua senha" />
                            <div class="helper-row">
                            </div>
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
    handlerOpcoes();
}

function handlerOpcoes() {
    document.getElementById('opcoes').addEventListener('click', (e) => {
        const elementoClicado = e.target

        if(elementoClicado.id === "entrar") {
            console.log("Efetivar login");
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