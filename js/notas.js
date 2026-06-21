let indiceEdicaoNotas = null;

// Reaproveita a sua lógica de carga de dados do localStorage/JSON
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

// Abre o modal de notas e preenche com os valores atuais do aluno selecionado
async function AbrirJanelaNotas(event) {
    let alunosOriginais = JSON.parse(localStorage.getItem("alunos")) || [];
    
    // Captura o índice real direto do botão clicado
    indiceEdicaoNotas = Number(event.target.dataset.indice);
    
    const aluno = alunosOriginais[indiceEdicaoNotas];

    if (!aluno) {
        console.error("Aluno não encontrado no índice informado.");
        return;
    }

    // Preenche os dados no modal perfeitamente
    document.getElementById("nomeAlunoModal").innerText = `Notas de ${aluno.nome}`;
    document.getElementById("nota1").value = aluno.nota1 !== undefined ? aluno.nota1 : 0;
    document.getElementById("nota2").value = aluno.nota2 !== undefined ? aluno.nota2 : 0;

    document.getElementById("modalNotas").classList.add("ativo");
}

// Renderiza a tabela de notas com suporte a ordenação compartilhada
function renderizarTabela(alunos) {
    let tabela = document.getElementById("tabelaNotas");
    tabela.innerHTML = "";
    
    // Buscamos a lista original para mapear corretamente o índice do botão, mesmo após ordenar
    let listaOriginal = JSON.parse(localStorage.getItem("alunos")) || [];

    for(let i = 0; i < alunos.length; i++) {
        let tr = document.createElement("tr");
        
        let n1 = Number(alunos[i].nota1) || 0;
        let n2 = Number(alunos[i].nota2) || 0;
        let media = (n1 + n2) / 2;
        
        let situacao;
        if (media >= 6) {
            situacao = "aprovado";
        } else if (media > 3) {
            situacao = "recuperação";
        } else {
            situacao = "reprovado";
        }

        // Descobre o índice real buscando por ID ou usando o nome como alternativa de segurança
        let indiceOriginal = -1;
        if (alunos[i].id) {
            indiceOriginal = listaOriginal.findIndex(a => a.id === alunos[i].id);
        } else {
            indiceOriginal = listaOriginal.findIndex(a => a.nome === alunos[i].nome);
        }
        
        // Se ainda assim não achar, adota a posição atual do loop
        if (indiceOriginal === -1) indiceOriginal = i;

        // Criação do botão "Notas"
        let notasBtn = document.createElement("button");
        notasBtn.innerText = "Notas";
        notasBtn.classList.add("BtnEditar"); 
        
        // Atribui o índice original mapeado
        notasBtn.dataset.indice = indiceOriginal;
        
        notasBtn.addEventListener("click", (event) => {
            AbrirJanelaNotas(event);
        });

        // Valores estruturados seguindo exatamente a ordem das colunas do seu HTML
        const valores = [
            alunos[i].nome,
            alunos[i].curso,
            alunos[i].semestre + ' º Período',
            n1.toFixed(1),
            n2.toFixed(1),
            media.toFixed(1), 
            situacao,
        ];

        for(let j = 0; j < valores.length; j++) {
            let td = document.createElement("td");
            td.innerText = valores[j];
            if (j === 6) { 
                if (situacao === "aprovado") td.classList.add("situacao-aprovado");
                    else if (situacao === "recuperação") td.classList.add("situacao-recuperacao");
                    else if (situacao === "reprovado") td.classList.add("situacao-reprovado");
            }
            tr.appendChild(td);
        }

        let tdAcao = document.createElement("td");
        tdAcao.appendChild(notasBtn);
        tr.appendChild(tdAcao);

        tabela.appendChild(tr);
    }
}

// Puxa os dados e aciona a renderização inicial
async function CompletarTabelaNotas() {
    let alunos = await carregarAlunos();
    renderizarTabela(alunos);
}

// Controle de fechar o modal
const modalNotas = document.getElementById("modalNotas");
const fecharNotas = document.getElementById("fecharModalNotas");

fecharNotas.addEventListener("click", () => {
    modalNotas.classList.remove("ativo");
    indiceEdicaoNotas = null;
});

// Executa as configurações assim que a página terminar de carregar o HTML
document.addEventListener("DOMContentLoaded", () => {
    // Inicializa os cliques de ordenação configurados no seu arquivo tabela.js
    if (typeof inicializarCliquesOrdenacao === "function") {
        inicializarCliquesOrdenacao(carregarAlunos, renderizarTabela);
    }

    // Salva as novas notas no índice correto do localStorage
    document.getElementById("salvarNotas").addEventListener("click", async () => {
        if (indiceEdicaoNotas !== null) {
            let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
            
            // Modifica as propriedades de nota do registro na posição exata mapeada
            alunos[indiceEdicaoNotas].nota1 = Number(document.getElementById("nota1").value);
            alunos[indiceEdicaoNotas].nota2 = Number(document.getElementById("nota2").value);

            localStorage.setItem("alunos", JSON.stringify(alunos));
            modalNotas.classList.remove("ativo");
            indiceEdicaoNotas = null;
            
            // Atualiza os dados recarregando a tabela na tela
            renderizarTabela(alunos);
        }
    });
});

// Inicializa a tabela ao carregar o script
CompletarTabelaNotas();