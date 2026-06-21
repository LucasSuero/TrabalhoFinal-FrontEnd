CompletarTabela()

let indiceEdicao = null;

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
    document.getElementById("nota1").value = aluno.nota1;
    document.getElementById("nota2").value = aluno.nota2;

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
        if (media > 7) {
            situacao = "aprovado";
        }else if (media < 7 && 6 < media) {
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
            nota1: Number(document.getElementById("nota1").value),
            nota2: Number(document.getElementById("nota2").value),
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
        document.getElementById("nota1").value = "";
        document.getElementById("nota2").value = "";
    }

    salvarCadastro.addEventListener("click", () => {

    cadastroAluno();

    modal.classList.remove("ativo");
    });

});