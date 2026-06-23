document.addEventListener("DOMContentLoaded", () => {
    gerarRelatorios();
});

function gerarRelatorios() {
    // Puxa os alunos do banco de dados (se estiver vazio, cria array vazio)
    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    if (alunos.length === 0) {
        alert("Nenhum aluno cadastrado para gerar relatórios!");
        return;
    }

    // Novo array calulando média e situação
    const alunosProcessados = alunos.map(aluno => {
        let media = (aluno.nota1 + aluno.nota2) / 2;
        let situacao = "reprovado";
        if (media >= 6) situacao = "aprovado";
        else if (media >= 4) situacao = "recuperação";

        return { ...aluno, media, situacao };
    });

    const totalAlunos = alunosProcessados.length;
    // O 'filter()' cria uma lista só com quem atende à condição, e o length conta quantos são.
    const aprovados = alunosProcessados.filter(a => a.situacao === "aprovado").length;
    const recuperacao = alunosProcessados.filter(a => a.situacao === "recuperação").length;
    const reprovados = alunosProcessados.filter(a => a.situacao === "reprovado").length;

    document.getElementById("totAlunos").innerText = totalAlunos;
    document.getElementById("totAprovados").innerText = aprovados;
    document.getElementById("totRecuperacao").innerText = recuperacao;
    document.getElementById("totReprovados").innerText = reprovados;

    // O 'reduce()' vai agrupar e contar os alunos por curso automaticamente
    const contagemCursos = alunosProcessados.reduce((acc, aluno) => {
        // Deixa o nome do curso em maiúsculo
        let cursoNome = aluno.curso.toUpperCase(); 
        acc[cursoNome] = (acc[cursoNome] || 0) + 1;
        return acc;
    }, {});

    const ulCursos = document.getElementById("listaCursos");
    ulCursos.innerHTML = ""; // Limpa a lista
    
    // Transforma o objeto de contagem em elementos de lista
    for (let curso in contagemCursos) {
        let li = document.createElement("li");
        li.innerText = `${curso}: ${contagemCursos[curso]} aluno(s)`;
        ulCursos.appendChild(li);
    }

    // Extrai apenas as médias para um array separado para facilitar os cálculos de máximo e mínimo
    const listaMedias = alunosProcessados.map(a => a.media);
    
    const maiorMedia = Math.max(...listaMedias);
    const menorMedia = Math.min(...listaMedias);
    
    // Soma todas as médias e divide pelo total de alunos
    const somaTotalMedias = listaMedias.reduce((soma, nota) => soma + nota, 0);
    const mediaGeral = somaTotalMedias / totalAlunos;

    const qtdMaiorMedia = alunosProcessados.filter(a => a.media === maiorMedia).length;
    const qtdAcimaMediaGeral = alunosProcessados.filter(a => a.media > mediaGeral).length;
    const qtdAbaixoMediaGeral = alunosProcessados.filter(a => a.media < mediaGeral).length;

    document.getElementById("maiorMedia").innerText = maiorMedia.toFixed(2);
    document.getElementById("menorMedia").innerText = menorMedia.toFixed(2);
    document.getElementById("mediaGeral").innerText = mediaGeral.toFixed(2);
    document.getElementById("qtdMaiorMedia").innerText = qtdMaiorMedia;
    document.getElementById("qtdAcimaMedia").innerText = qtdAcimaMediaGeral;
    document.getElementById("qtdAbaixoMedia").innerText = qtdAbaixoMediaGeral;

    // Copia a lista, ordena da maior para a menor média, e "corta" os 5 primeiros usando o slice
    const top5 = [...alunosProcessados]
        .sort((a, b) => b.media - a.media)
        .slice(0, 5);

    const olTop5 = document.getElementById("listaTop5");
    olTop5.innerHTML = ""; // Limpa a lista
    
    top5.forEach(aluno => {
        let li = document.createElement("li");
        li.innerText = `${aluno.nome} - Média: ${aluno.media.toFixed(2)} (${aluno.curso})`;
        olTop5.appendChild(li);
    });
}
