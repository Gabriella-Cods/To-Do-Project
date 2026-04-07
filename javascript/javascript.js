document.addEventListener('DOMContentLoaded', () => {
    // --- 1. LÓGICA DE CADASTRO DE USUÁRIO ---
    const formCadastro = document.getElementById('formulario-cadastro');

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                const response = await fetch("/cadastrar", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                const result = await response.json();

                if (result.sucesso) {
                    alert("Usuário salvo com sucesso!");
                    // Redireciona automaticamente para a página de categorias
                    window.location.href = "/categoria.html"; 
                } else {
                    alert("Erro ao salvar usuário.");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }

    // --- 2. LÓGICA DE CADASTRO DE CATEGORIAS ---
    const formCat = document.getElementById('form-categoria');

    if (formCat) {
        formCat.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome-categoria').value;

            try {
                const response = await fetch("/cadastrar_categoria", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome })
                });

                const result = await response.json();

                if (result.sucesso) {
                    alert("Categoria cadastrada com sucesso!");
                    document.getElementById('nome-categoria').value = ""; // Limpa o campo
                } else {
                    alert("Erro ao salvar categoria.");
                }
            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});