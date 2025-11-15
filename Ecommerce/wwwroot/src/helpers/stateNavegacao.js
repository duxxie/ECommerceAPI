let navegacao = localStorage.getItem('navegacao') ?? "";

export function getNavegacaoState() {
    return navegacao;
}

export function setNavegacaoState(newState) {
    navegacao = newState;
    localStorage.setItem('navegacao', navegacao);
}