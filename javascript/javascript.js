document.addEventListener('DOMContentLoaded', () => {
    
    // --- FUNÇÃO PARA CARREGAR O SELECT ---
    const carregarCategoriasNoSelect = async () => {
        const select = document.getElementById('select-categoria');
        if (!select) return;

        try {
            const response = await fetch('/get_categorias');
            const categorias = await response.json();

            select.innerHTML = '<option value="">Vincular à Categoria...</option>';
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nome;
                select.appendChild(option);
            });
        } catch (e) {
            console.error("Erro ao carregar categorias:", e);
        }
    };

    // --- 1. LOGIN DE USUÁRIO ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const email = document.getElementById('login-email').value;
            const senha = document.getElementById('login-senha').value;

            try {
                const response = await fetch("/login", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                const result = await response.json();

                if (result.sucesso) {
                    alert("Login efetuado com sucesso!");
                    window.location.href = "/categoria.html"; 
                } else {
                    alert("Erro: " + result.mensagem); 
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
                alert("Erro técnico: O servidor Python (app.py) está rodando?");
            }
        });
    }

    // --- 2. CADASTRO DE USUÁRIO ---
    const formCadastro = document.getElementById('formulario-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value
            };

            const response = await fetch("/cadastrar", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if ((await response.json()).sucesso) {
                alert("Usuário cadastrado com sucesso!");
                window.location.href = "/categoria.html";
            }
        });
    }

    // --- 3. CADASTRO DE CATEGORIAS ---
    const formCat = document.getElementById('form-categoria');
    if (formCat) {
        formCat.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome-categoria').value;

            const response = await fetch("/cadastrar_categoria", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            });

            if ((await response.json()).sucesso) {
                alert("Categoria criada!");
                document.getElementById('nome-categoria').value = "";
                carregarCategoriasNoSelect(); 
            }
        });
    }

    // --- 4. CADASTRO DE TAREFAS ---
    const formTarefa = document.getElementById('form-tarefa');
    if (formTarefa) {
        formTarefa.addEventListener('submit', async (e) => {
            e.preventDefault();
            const dados = {
                descricao: document.getElementById('desc-tarefa').value,
                categoria_id: document.getElementById('select-categoria').value,
                inicio: document.getElementById('data-inicio').value,
                fim: document.getElementById('data-fim').value
            };

            const response = await fetch('/cadastrar_tarefa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if ((await response.json()).sucesso) {
                alert("Tarefa agendada!");
                formTarefa.reset();
            }
        });
    }

    // Inicializa o select ao abrir a página
    carregarCategoriasNoSelect();
});


