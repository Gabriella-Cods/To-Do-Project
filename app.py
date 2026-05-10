from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__, 
            template_folder='.', 
            static_folder='.', 
            static_url_path='')

def init_db():
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    # Tabela de Usuários
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT,
            senha TEXT
        )
    ''')
    # Tabela de Categorias
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL
        )
    ''')
    # Tabela de Tarefas - CORRIGIDA
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            descricao TEXT NOT NULL,
            data_inicio TEXT,
            data_fim TEXT,
            categoria_id INTEGER,
            FOREIGN KEY (categoria_id) REFERENCES categorias (id)
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('telainicial.html')

@app.route('/cadastro.html')
def pagina_cadastro():
    return render_template('cadastro.html')







@app.route('/login', methods=['POST'])
def login():
    dados = request.json
    email = dados.get('email')
    senha = dados.get('senha')
    
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    
    # Busca um usuário onde o e-mail E a senha batem com o que foi digitado
    cursor.execute('SELECT * FROM usuarios WHERE email = ? AND senha = ?', (email, senha))
    usuario = cursor.fetchone()
    conn.close()

    if usuario:
        # Se encontrar um registro (como os dados que você tem na image_4c7e91.png)
        return jsonify({"sucesso": True})
    else:
        # Se não encontrar nada ou a senha estiver errada
        return jsonify({"sucesso": False, "mensagem": "E-mail ou senha incorretos!"})


@app.route('/categoria.html')
def pagina_categoria():
    return render_template('categoria.html')

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

@app.route('/get_categorias', methods=['GET'])
def get_categorias():
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM categorias')
    lista = [{"id": row[0], "nome": row[1]} for row in cursor.fetchall()]
    conn.close()
    return jsonify(lista)

@app.route('/cadastrar_tarefa', methods=['POST'])
def cadastrar_tarefa():
    dados = request.json
    conn = sqlite3.connect('meu_banco.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tarefas (descricao, data_inicio, data_fim, categoria_id)
        VALUES (?, ?, ?, ?)
    ''', (dados['descricao'], dados['inicio'], dados['fim'], dados['categoria_id']))
    conn.commit()
    conn.close()
    return jsonify({"sucesso": True})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=3000)