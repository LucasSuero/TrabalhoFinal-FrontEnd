CompletarTabela()

// variavel que armazena o indice do aluno que está sendo editado 
//Se for null, significa que não estamos editando nenhum aluno (modo cadastro)
let indiceEdicao = null;

let ordemNome = true;
let ordemCurso = true;
let ordemSemestre = true;
let ordemMedia = true;
let ordemSituacao = true;

//Funcao responsavel por puxas as informações do Json
async function carregarAlunos() {

    let alunosStorage = JSON.parse(localStorage.getItem("alunos"));

    if (alunosStorage && alunosStorage.length > 0) {
        return alunosStorage;
    }

    const response = await fetch("../js/alunos.json", {
        cache: "no-store"
    });

    const alunos = await response.json();

    localStorage.setItem("alunos", JSON.stringify(alunos));

    return alunos;
}
//funcao do botao excluir
async function ExcluirAluno(event) {
    const alunos = await carregarAlunos()
    console.log(alunos);
    const indice = Number(event.target.dataset.indice);    

    if(confirm("Deseja realmente exclur este aluno?")) {
        alunos.splice(indice, 1);
        localStorage.setItem("alunos", JSON.stringify(alunos));
        console.log(alunos);
        CompletarTabela();
    }
}
//funcao do botao de editar
async function EditarAluno(event) {

    const alunos = await carregarAlunos();

    indiceEdicao = Number(event.target.dataset.indice);

    const aluno = alunos[indiceEdicao];

    document.getElementById("nome").value = aluno.nome;
    document.getElementById("nascimento").value = aluno.nascimento;
    document.getElementById("curso").value = aluno.curso;
    document.getElementById("semestre").value = aluno.semestre;
    /* document.getElementById("nota1").value = aluno.nota1;
    document.getElementById("nota2").value = aluno.nota2; */

    modal.classList.add("ativo");
}

//Funcao resposavel por completar as informações do json para dentro da tabela
async function CompletarTabela() {
    let alunos = await carregarAlunos();
    let tabela = document.getElementById("tabelaAlunos");

    tabela.innerHTML = "";
    
    for(let i= 0; i < alunos.length; i++) {
        let tr = document.createElement("tr");
        let media = (alunos[i].nota1 + alunos[i].nota2)/2
        let situacao;
        if (media >= 6) {
            situacao = "aprovado";
        }else if (media > 3) {
            situacao = "recuperação"
        } else {
            situacao = "reprovado"
        }

        let editarBtn = document.createElement("button");
        editarBtn.innerText = "Editar";
        editarBtn.classList.add("BtnEditar");
        editarBtn.dataset.indice = i;
        editarBtn.addEventListener("click", (event) => {
            EditarAluno(event);
        })

        let excluirBtn = document.createElement("button");
        excluirBtn.innerText = "Excluir";
        excluirBtn.classList.add("BtnExcluir");
        excluirBtn.dataset.indice = i;
        excluirBtn.addEventListener("click", (event) => {
            ExcluirAluno(event);
        })

        const valores = [
            alunos[i].nome,
            alunos[i].curso,
            alunos[i].semestre +' º Período',
            (alunos[i].nota1 + alunos[i].nota2)/2,
            situacao,
        ];

        for(let j = 0; j < valores.length; j++) {
            let td = document.createElement("td");
            td.innerText = valores[j];
            if (j === 4) { 
                if (situacao === "aprovado") td.classList.add("situacao-aprovado");
                else if (situacao === "recuperação") td.classList.add("situacao-recuperacao");
                else if (situacao === "reprovado") td.classList.add("situacao-reprovado");
            }
            tr.appendChild(td);
        }

        let td = document.createElement("td");
        td.appendChild(editarBtn);
        td.appendChild(excluirBtn);
        tr.appendChild(td);

        tabela.appendChild(tr);
    }
}

CompletarTabela();
//abrir e fechar tela de cadastrr
const modal = document.getElementById("modal");
const abrir = document.getElementById("abrirModal");
const fechar = document.getElementById("fecharModal");

abrir.addEventListener("click", () => {
    modal.classList.add("ativo");
});

fechar.addEventListener("click", () => {
    modal.classList.remove("ativo");
});
//caixa cadastro alunos
document.addEventListener("DOMContentLoaded", () => {

    const salvarCadastro = document.getElementById("salvarCadastro");

    function cadastroAluno() {

        const novoAluno = {
            id: Date.now(),
            nome: document.getElementById("nome").value,
            nascimento: document.getElementById("nascimento").value,
            curso: document.getElementById("curso").value,
            semestre: document.getElementById("semestre").value,
            nota1: null,
            nota2: null,
        };

        let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

        if (indiceEdicao !== null) {
            alunos[indiceEdicao] = novoAluno;
            indiceEdicao = null;
        } else {
            alunos.push(novoAluno);
        }

        localStorage.setItem("alunos", JSON.stringify(alunos));

        CompletarTabela();

        document.getElementById("nome").value = "";
        document.getElementById("nascimento").value = "";
        document.getElementById("curso").value = "";
        document.getElementById("semestre").value = "";
        /* document.getElementById("nota1").value = "";
        document.getElementById("nota2").value = ""; */
    }

    salvarCadastro.addEventListener("click", () => {

    cadastroAluno();

    modal.classList.remove("ativo");
    });

});
//ordenar a tabela por nome
async function ordenarNome() {
    let alunos = await carregarAlunos();
    alunos.sort((a, b) => {
        if (ordemNome) {
            return a.nome.localeCompare(b.nome);
        }

        return b.nome.localeCompare(a.nome);
    });

    ordemNome = !ordemNome;
    localStorage.setItem("alunos", JSON.stringify(alunos));
    CompletarTabela();
}
//ordenar por curso
async function ordenarCurso() {
    let alunos = await carregarAlunos();
    alunos.sort((a, b) => {
        if (ordemCurso) {
            return a.curso.localeCompare(b.curso);
        }

        return b.curso.localeCompare(a.curso);
    });

    ordemCurso = !ordemCurso;
    localStorage.setItem("alunos", JSON.stringify(alunos));
    CompletarTabela();
}
//ordenar por semestre
async function ordenarSemestre() {
    let alunos = await carregarAlunos();
    alunos.sort((a, b) => {
        if (ordemSemestre) {
            return a.semestre - b.semestre;
        }

        return b.semestre - a.semestre;
    });

    ordemSemestre = !ordemSemestre;
    localStorage.setItem("alunos", JSON.stringify(alunos));
    CompletarTabela();
}
//ordenar por media
async function ordenarMedia() {
    let alunos = await carregarAlunos();
    alunos.sort((a, b) => {
        let mediaA = (a.nota1 + a.nota2) / 2;
        let mediaB = (b.nota1 + b.nota2) / 2;
        if (ordemMedia) {
            return mediaA - mediaB;
        }

        return mediaB - mediaA;
    });

    ordemMedia = !ordemMedia;
    localStorage.setItem("alunos", JSON.stringify(alunos));
    CompletarTabela();
}
//ordenar por situacao
async function ordenarSituacao() {
    let alunos = await carregarAlunos();
    alunos.sort((a, b) => {
        let mediaA = (a.nota1 + a.nota2) / 2;
        let mediaB = (b.nota1 + b.nota2) / 2;

        let situacaoA =
            mediaA > 7 ? "aprovado" :
            mediaA > 6 ? "recuperação" :
            "reprovado";

        let situacaoB =
            mediaB > 7 ? "aprovado" :
            mediaB > 6 ? "recuperação" :
            "reprovado";

        if (ordemSituacao) {
            return situacaoA.localeCompare(situacaoB);
        }

        return situacaoB.localeCompare(situacaoA);
    });

    ordemSituacao = !ordemSituacao;
    localStorage.setItem("alunos", JSON.stringify(alunos));
    CompletarTabela();
}
//quando clica nos botoes chama as funcoes acima
    document.getElementById("ordNome")
        .addEventListener("click", ordenarNome);

    document.getElementById("ordCurso")
        .addEventListener("click", ordenarCurso);

    document.getElementById("ordSemestre")
        .addEventListener("click", ordenarSemestre);

    document.getElementById("ordMedia")
        .addEventListener("click", ordenarMedia);

    document.getElementById("ordSituacao")
        .addEventListener("click", ordenarSituacao);
