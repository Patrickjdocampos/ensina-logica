# Ensina Lógica - Assistente Pedagógico com IA

Aplicação web full-stack criada para apoiar estudantes no aprendizado de lógica de programação por meio de explicações pedagógicas com inteligência artificial.

## Visão geral

O **Ensina Lógica** é um sistema educacional que combina frontend, backend, autenticação, persistência de dados e IA generativa para oferecer uma experiência de estudo mais interativa e personalizada.

A proposta do projeto é permitir que o aluno faça perguntas sobre lógica de programação e receba explicações mais claras, estruturadas e adaptadas ao seu contexto de aprendizado.

## Problema que o projeto resolve

Muitos estudantes têm dificuldade em aprender lógica de programação porque:

- não conseguem acompanhar explicações muito abstratas
- precisam de exemplos mais guiados
- têm medo de errar ao perguntar
- nem sempre recebem acompanhamento individualizado

O Ensina Lógica foi pensado para reduzir essa barreira, oferecendo uma interface de apoio com respostas pedagógicas, histórico de conversas e organização por sessões.

## Objetivos do projeto

- apoiar o ensino de lógica de programação
- oferecer explicações geradas por IA de forma acessível
- registrar histórico de interações por usuário
- estruturar um produto educacional real com backend, frontend e banco de dados
- servir como base para evolução futura em direção a sistemas educacionais mais inteligentes

## Arquitetura do projeto

O sistema está dividido em duas camadas principais:

### Frontend
Responsável pela interface do usuário, navegação e visualização das respostas.

### Backend
Responsável pela autenticação, regras de negócio, persistência de dados e integração com o modelo de IA.

## Stack utilizada

### Frontend
- **React**
- **Vite**
- **Axios**
- **React Router DOM**
- **React Markdown**
- **React Syntax Highlighter**
- **Recharts**

### Backend
- **Python**
- **FastAPI**
- **SQLAlchemy**
- **JWT**
- **bcrypt / passlib**
- **Google Gemini**
- **Uvicorn**

### Banco de dados
- **PostgreSQL** em produção
- **SQLite** para desenvolvimento local

## Estrutura atual do projeto

```bash
ensina-logica/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   ├── check_db.py
│   ├── check_logs.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── legacy/
│   └── cli_v1/
├── README.md
└── netlify.toml
