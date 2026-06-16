const estaEmPages = 
window.location.pathname.includes("/pages/");

const base = estaEmPages ? "../" : "./";

document.getElementById("header").innerHTML = `
    <div class="topo">
        <h1>Portal Acadêmico</h1>
        <h2>Feito para modernizar o sistema acadêmico</h2>
    </div>

    <div class="selecao">
        <a href="${base}/index.html">Início</a>
        <a href="${base}/pages/alunos.html">Alunos</a>
        <a href="${base}/pages/notas.html">Notas</a>
        <a href="${base}/pages/relatorios.html">Relatórios</a>
        <a href="${base}/pages/sobre.html">Sobre</a>
    </div>
`;
console.log("Header Carregado!");