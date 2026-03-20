# Ensina Lógica - Assistente Pedagógico com IA

Um sistema web *full-stack* projetado para auxiliar estudantes no aprendizado de lógica de programação. A aplicação utiliza inteligência artificial generativa para fornecer explicações pedagógicas, adaptadas ao nível de conhecimento do usuário e ao tópico de estudo escolhido.

## Arquitetura e Tecnologias

O projeto adota uma arquitetura de microsserviços distribuída em nuvem, separando claramente as responsabilidades de interface, processamento de regras de negócio e persistência de dados.

### Frontend (Interface de Usuário)
* **Framework:** React.js com Vite
* **Linguagem:** JavaScript
* **Estilização e UX:** Componentes reativos, Syntax Highlighting (Prism) para blocos de código e renderização de Markdown.
* **Hospedagem (Produção):** Netlify

### Backend (API e Regras de Negócio)
* **Framework:** FastAPI
* **Linguagem:** Python 3
* **Segurança:** Autenticação baseada em JWT (JSON Web Tokens) e hash de senhas (bcrypt).
* **Integração de IA:** Google Gemini API
* **Hospedagem (Produção):** Render

### Banco de Dados
* **SGBD:** PostgreSQL (Produção) / SQLite (Desenvolvimento Local)
* **ORM:** SQLAlchemy
* **Hospedagem (Produção):** Neon Tech

---

## Funcionalidades Principais

* **Autenticação de Usuários:** Cadastro e login com sessões seguras.
* **Chatbot Pedagógico:** Respostas geradas por IA com formatação automática de código.
* **Persistência de Histórico:** As sessões de chat são salvas em banco de dados relacional e vinculadas ao usuário.
* **Gestão de Sessões:** Criação de novos chats, histórico na barra lateral e deleção de conversas.
* **Painel Administrativo:** Visualização de logs de uso e métricas básicas de estudo.
