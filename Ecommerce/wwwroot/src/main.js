const API = 'http://localhost:5039';

async function carregarProdutos() {

    const resposta = await fetch(`${API}/produtos`);
    const produtos = await resposta.json();
    return produtos
}

async function mostrarProdutos() {
    const itens = await carregarProdutos();

    const frag = document.createDocumentFragment();

    itens.forEach(item => {
        const paragrafo = document.createElement('p');
        paragrafo.dataset.id = item.id;
        paragrafo.innerHTML = `
            Nome: ${item.nome};<br>
            Descrição: ${item.descricao};<br>
            Preco: ${item.preco};<br>
            Estoque: ${item.estoque};<br>
            Categoria: ${item.categoria};
        `;
        frag.appendChild(paragrafo);
    });

    return frag
}

document.addEventListener('DOMContentLoaded', async () => {
    const root = document.getElementById('root');
    const conteudo = await mostrarProdutos();
    root.appendChild(conteudo);
})