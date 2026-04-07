from flask import Flask, render_template, request, jsonify
import sqlite3
import os

# O segredo está aqui: static_url_path='' permite que o Flask ache a pasta /styles/ na raiz
app = Flask(__name__, 
            template_folder='.', 
            static_folder='.', 
            static_url_path='')

def init_db():
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            senha TEXT
        )
    ''')
    # NOVA TABELA: Categorias
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Rota para a página inicial (Ajuste o @app.route para '/' apenas)
@app.route('/')
def home():
    return render_template('telainicial.html')

# Rotas para as outras páginas funcionarem sem dar 404
@app.route('/cadastro.html')
def pagina_cadastro():
    return render_template('cadastro.html')

@app.route('/login.html')
def pagina_login():
    return render_template('login.html')

# Rota para SALVAR no banco de dados
@app.route('/cadastrar', methods=['POST'])
def cadastrar():
    dados = request.json
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', 
                   (dados['nome'], dados['email'], dados['senha']))
    conn.commit()
    conn.close()
    return jsonify({"sucesso": True})






@app.route('/cadastrar_categoria', methods=['POST'])
def cadastrar_categoria():
    dados = request.json
    nome_cat = dados.get('nome')
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO categorias (nome) VALUES (?)', (nome_cat,))
    conn.commit()
    conn.close()
    return jsonify({"sucesso": True})


@app.route('/categoria.html')
def pagina_categoria():
    return render_template('categoria.html')




if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=3000)