document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-cadastro');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Captura os valores usando os IDs que colocamos no HTML
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            try {
                // AQUI ESTAVA O ERRO: Mudamos de "/cadastro.html" para "/cadastrar"
                const response = await fetch("/cadastrar", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email, senha })
                });

                const result = await response.json();

                if (result.sucesso) {
                    alert("Usuário salvo com sucesso!");
                    window.location.href = "/"; // Redireciona para o login
                } else {
                    alert("Erro ao salvar dados.");
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro ao conectar com o servidor.");
            }
        });
    }
});