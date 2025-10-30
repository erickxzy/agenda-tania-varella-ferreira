# 📚 Agenda Escolar Tânia Varella Ferreira

Sistema completo de gestão escolar com autenticação, gerenciamento de eventos, cardápios, avisos e muito mais.

## 📁 Estrutura do Projeto

```
📦 agenda-escolar/
├── 📄 index.html          # Página principal
├── 📄 server.js           # Servidor backend Node.js
├── 📄 package.json        # Dependências do projeto
├── 📄 escola.db           # Banco de dados SQLite
└── 📁 src/                # Código fonte frontend
    ├── 📄 style.css       # Estilos CSS
    └── 📄 script.js       # JavaScript do cliente
```

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18 ou superior

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/agenda-escolar.git
cd agenda-escolar
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor:
```bash
node server.js
```

4. Acesse no navegador:
```
http://localhost:5000
```

## 🔑 Credenciais de Acesso

### Administrador
- **Usuário:** admin
- **Senha:** admin1

### Aluno
- Faça cadastro usando e-mail com domínio `@escola.pr.gov.br`

### Direção
- Faça cadastro usando qualquer e-mail válido

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- bcryptjs (criptografia de senhas)

### Frontend
- HTML5
- CSS3 (com variáveis CSS e modo escuro)
- JavaScript vanilla
- Design responsivo

## 📋 Funcionalidades

- ✅ Sistema de autenticação (Aluno, Direção, Admin)
- ✅ Gerenciamento de eventos por série
- ✅ Cardápio semanal editável
- ✅ Sistema de avisos e atividades
- ✅ Agenda de professores
- ✅ Notificações em tempo real
- ✅ Modo escuro/claro
- ✅ Recuperação de senha
- ✅ Design responsivo

## 📤 Como Subir no GitHub

```bash
# Inicializar repositório Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add index.html src/ server.js package.json package-lock.json escola.db README.md

# Fazer commit
git commit -m "Primeiro commit - Agenda Escolar"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/seu-repositorio.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

## 🌐 Deploy

Para fazer deploy da aplicação, você pode usar:
- **Replit** (recomendado - já configurado)
- **Heroku**
- **Railway**
- **Vercel** (necessita configuração adicional)
- **DigitalOcean**

## 👥 Criadores

- 🎓 Erick Gustavo Dos Santos Gomes
- 🎓 Adryan Kaick da Silva Cassula
- 🎓 Victor Hugo Nunes da Costa
- 🎓 Sophia Monteiro de Paula

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

---

Desenvolvido com ❤️ por alunos da Escola Tânia Varella Ferreira
