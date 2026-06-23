// 1. Dados dos alunos simulando um arquivo JSON
const alunosJSON = [
    {
        "nome": "Leonardo Kenji",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da.",
        "foto": "../img/Foto Leonardo.jpeg" // Imagem de placeholder
    },
    {
        "nome": "Lucas Suero",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da Unicesumar.",
        "foto": "../img/Foto Lucas.jpeg"
    },
    {
        "nome": "Tiago Joslin",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da Unicesumar",
        "foto": "../img/Foto Tiago.jpeg"
    }
];

// Manipulação do DOM após o carregamento da página
document.addEventListener("DOMContentLoaded", () => {
    
    // Busca a div container lá no HTML
    const container = document.getElementById("perfis-container");

    // Passa por cada aluno dentro do JSON
    alunosJSON.forEach(aluno => {
        
        // Cria a div que será o card
        const card = document.createElement("div");
        card.className = "card";

        // Injeta os dados do JSON dentro do HTML do card
        card.innerHTML = `
            <img src="${aluno.foto}" alt="Foto de ${aluno.nome}">
            <h3>${aluno.nome}</h3>
            <h4>${aluno.papel}</h4>
            <p>${aluno.descricao}</p>
        `;

        // Adiciona o card pronto lá na tela (dentro do container)
        container.appendChild(card);
    });
});
