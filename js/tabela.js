//Funcao responsavel por puxas as informações do Json
async function carregarAlunos() {
    const response = await fetch("../js/alunos.json", {
        cache: "no-store"
    });

    const alunos = await response.json();

    return alunos;
}

//Funcao resposavel por completar as informações do json para dentro da tabela
async function CompletarTabela() {
    const alunos = await carregarAlunos();
    let tabela = document.getElementById("tabelaAlunos");

    tabela.innerHTML = "";
    
    for(let i= 0; i < alunos.length; i++) {
    let tr = document.createElement("tr");
    const valores = [
        alunos[i].nome,
        alunos[i].curso,
        alunos[i].semestre +' º Período',
        (alunos[i].nota1 + alunos[i].nota2)/2,
        alunos[i].situacao
    ];

    for(let j = 0; j < valores.length; j++) {
        let td = document.createElement("td");
        td.innerText = valores[j];
        tr.appendChild(td);
    }

    tabela.appendChild(tr);
    }
}

CompletarTabela();

const modal = document.getElementById("modal");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");

abrir.addEventListener("click", () => {
    modal.classList.add("ativo");
});

fechar.addEventListener("click", () => {
    modal.classList.remove("ativo");
});
