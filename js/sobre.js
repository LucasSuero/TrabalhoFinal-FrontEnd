// 1. Dados dos alunos simulando um arquivo JSON
const alunosJSON = [
    {
        "nome": "Leonardo Kenji",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da.",
        "foto": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" // Imagem de placeholder
    },
    {
        "nome": "Lucas Suero",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da Unicesumar.",
        "foto": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
    {
        "nome": "Tiago Joslin",
        "papel": "Aluno Engenharia de Software",
        "descricao": "Estudante de Engenharia de Software da Unicesumar.",
        "foto": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
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
