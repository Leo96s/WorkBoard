# WorkBoard 📋

Um quadro de tarefas em estilo **Kanban** que permite às equipas organizar o trabalho de forma clara e eficiente. Construído com **ASP.NET Core** (backend) e **Next.js** (frontend).

## 📸 Características

- ✅ Interface Kanban com drag & drop
- ✅ Gestão de múltiplos boards
- ✅ Colunas personalizáveis com cores
- ✅ Tarefas com tags, descrição e responsável
- ✅ Autenticação por Basic Auth
- ✅ API RESTful completa com Swagger
- ✅ Persistência em memória (pronta para migração para base de dados)

---

## Decisões Tomadas

Durante o desenvolvimento deste projeto foram tomadas algumas decisões técnicas com o objetivo de manter a solução simples, focada nos requisitos propostos e rápida de executar por qualquer pessoa que a queira avaliar.

### Utilização de Persistência em Memória

Foi escolhida uma implementação **In-Memory** em vez de uma base de dados tradicional.

O enunciado indicava explicitamente que a persistência poderia ser feita em memória e, tratando-se de uma demonstração técnica, a utilização de uma base de dados introduziria complexidade adicional no setup (instalação, configuração, migrações e gestão de ligações) sem acrescentar valor relevante para os objetivos da avaliação.

Desta forma, a aplicação pode ser executada imediatamente após o arranque do backend, permitindo focar a avaliação na arquitetura da API, na organização do código e na implementação das funcionalidades solicitadas.

### Utilização de Basic Authentication

Foi utilizada **Basic Authentication** com credenciais fixas em vez de JWT.

O desafio não requeria registo de utilizadores, gestão de contas, refresh tokens ou sessões. O objetivo era apenas demonstrar a proteção dos endpoints da API através de um mecanismo de autenticação simples.

A utilização de JWT acrescentaria componentes que não eram necessários para o contexto deste projeto, como endpoints de login, geração de tokens, gestão de expiração e armazenamento dos mesmos no frontend.

Assim, a Basic Authentication permite cumprir o requisito de segurança pedido de forma mais simples e adequada à dimensão da aplicação.

### Arquitetura em Camadas

O backend foi organizado utilizando uma separação clara de responsabilidades:

* **Controllers** para exposição dos endpoints REST.
* **Services** para a lógica de negócio.
* **Repositories** para abstração da camada de dados.
* **DTOs** para comunicação entre cliente e servidor.

Esta abordagem facilita a manutenção, evolução e testabilidade da aplicação.

### Utilização de Repositórios In-Memory

Mesmo utilizando persistência em memória, foi mantida uma camada de repositórios através de interfaces.

Isto permite que, futuramente, a aplicação possa ser migrada para uma base de dados real com impacto mínimo na lógica de negócio, bastando substituir as implementações dos repositórios.

### Interface Kanban Simples e Funcional

O frontend foi desenvolvido com foco na simplicidade e usabilidade, privilegiando uma experiência semelhante a um quadro Kanban tradicional.

Foram implementadas as funcionalidades pedidas no desafio:

* Visualização das colunas do quadro.
* Criação e edição de cartões.
* Movimentação de cartões entre colunas.
* Filtragem por responsável.
* Integração com a API protegida por autenticação.

Adicionalmente, foi implementado suporte para interação mais intuitiva através de drag-and-drop para movimentação dos cartões entre colunas.

### Funcionalidades Extra

Embora não fossem requisitos obrigatórios, foram adicionadas algumas funcionalidades para melhorar a experiência de utilização:

* Suporte a múltiplos boards.
* Organização dos cartões por tags.
* Interface modal para criação e edição de elementos.
* Estrutura preparada para futura expansão da aplicação.


## 🚀 Guia de Instalação e Execução

### Pré-requisitos

Antes de começar, certifique-se de que tem instalado:

- **Backend**: [.NET 10 SDK](https://dotnet.microsoft.com/download)
- **Frontend**: [Node.js 18+](https://nodejs.org/) e npm

### Verificar Instalação

```bash
# Verificar .NET
dotnet --version

# Verificar Node.js e npm
node --version
npm --version
```

---

## 📁 Estrutura do Projeto

```
WorkBoard/
├── backend/                      # ASP.NET Core API
│   ├── Controllers/              # Endpoints da API
│   ├── Services/                 # Lógica de negócio
│   ├── Repositories/             # Acesso a dados
│   ├── DTOs/                     # Data Transfer Objects
│   ├── Models/                   # Modelos de dados
│   ├── Middleware/               # Middleware de autenticação
│   ├── Properties/               # Configurações (launchSettings.json)
│   ├── appsettings.json          # Configuração principal
│   ├── appsettings.Development.json
│   ├── .env                      # ⚠️ FICHEIRO CRÍTICO (não incluído no git)
│   ├── Program.cs                # Ponto de entrada
│   └── backend.csproj            # Ficheiro do projeto
│
├── frontend/                     # Next.js React App
│   ├── src/
│   │   ├── app/                  # Layout e página principal
│   │   ├── components/           # Componentes React
│   │   ├── lib/                  # Utilitários (API client, cores)
│   │   │   │ 
│   │   │   ├── hooks/            # Hooks criados para o projeto
│   │   │   └── utils/            # Métodos utilitários do projeto
│   │   └── types/                # TypeScript interfaces
│   ├── .env                      # ⚠️ FICHEIRO CRÍTICO (não incluído no git)
│   ├── package.json              # Dependências npm
│   ├── next.config.ts            # Configuração Next.js
│   └── tsconfig.json             # Configuração TypeScript
│
├── REQUIREMENTS.md               # Requisitos do projeto
├── USECASES.md                   # Use Cases do projeto
├── TEST_CASES.md                 # Documentação dos testes implementados no projeto
├── README.md                     # Este ficheiro
├── CHANGELOG.md                  # Histórico de versões
└── LICENSE
```

---

## ⚙️ Configuração de Ficheiros Externos

### 1️⃣ Ficheiro `.env` do Backend

**Localização**: `backend/.env`

Crie um novo ficheiro **`.env`** na pasta `backend/` com as credenciais de autenticação:

> ⚠️ **IMPORTANTE**: Este ficheiro **NÃO** está no repositório por razões de segurança. Deve ser criado manualmente.

**Valores sugeridos para desenvolvimento**:
- `AUTH_USER`: admin / user / seu_usuario
- `AUTH_PASS`: password123 / sua_senha

### 2️⃣ Ficheiro `.env.local` do Frontend

**Localização**: `frontend/.env.local`

Crie um novo ficheiro **`.env.local`** na pasta `frontend/` com as credenciais e URL da API:

> ⚠️ **IMPORTANTE**: Este ficheiro **NÃO** está no repositório por razões de segurança. Deve ser criado manualmente.

**Valores esperados**:
- `NEXT_PUBLIC_AUTH_USER`: Deve corresponder ao `AUTH_USER` do backend
- `NEXT_PUBLIC_AUTH_PASS`: Deve corresponder ao `AUTH_PASS` do backend
- `NEXT_PUBLIC_API_URL`: URL base da API do backend (ajuste a porta conforme necessário)

---

## 🏃 Como Executar o Projeto

### **Opção 1: Executar Backend e Frontend Separadamente**

#### Passo 1: Executar o Backend

1. Abra uma terminal/PowerShell
2. Navegue até à pasta `backend`:

```bash
cd backend
```

3. Crie o ficheiro `.env` (ver secção acima) e adicione

4. Execute o backend:

```bash
dotnet run
```

**Esperado**: O backend inicia em `http://localhost:5282`

```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5282
```

> 📌 Deixe esta terminal aberta

#### Passo 2: Executar o Frontend

1. Abra **outra terminal** (em novo terminal/tab)
2. Navegue até à pasta `frontend`:

```bash
cd frontend
```

3. Crie o ficheiro `.env.local` (ver secção acima) e adicione

4. Instale as dependências (primeira vez apenas):

```bash
npm install
```

5. Execute o frontend em modo desenvolvimento:

```bash
npm run dev
```

**Esperado**: O frontend inicia em `http://localhost:3000`

```
▲ Next.js 16.2.6
- Local:        http://localhost:3000
```

#### Passo 3: Abra no Browser

Abra `http://localhost:3000` no seu navegador.

---

### **Opção 2: Executar Ambos com Scripts Automáticos (Windows PowerShell)**

Crie um ficheiro **`run-all.ps1`** na raiz do projeto:

```powershell
# run-all.ps1
Write-Host "🚀 Iniciando WorkBoard (Backend + Frontend)..." -ForegroundColor Cyan

# Inicia backend em nova janela
Write-Host "📦 Iniciando Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; dotnet run"

# Aguarda 3 segundos para o backend iniciar
Start-Sleep -Seconds 3

# Inicia frontend em nova janela
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Blue
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev"

Write-Host "✅ Ambiente pronto!" -ForegroundColor Green
Write-Host "   Backend: http://localhost:5282" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Yellow
```

Execute com:

```bash
.\run-all.ps1
```

---

## 🧪 Testar a API

### Via Swagger UI

Abra no browser: `http://localhost:5282/swagger`

**Para autenticar**:
1. Clique no botão "Authorize" (cadeado no canto superior direito)
2. Introduza as credenciais
3. Clique "Authorize"

### Via Postman

1. Abra Postman
2. Vá para a aba "Authorization"
3. Selecione "Basic Auth"
4. Digite as credenciais
5. Clique em "Send"

---

## 🛠️ Comandos Úteis

### Backend (.NET)

```bash
# Navegar até backend
cd backend

# Restaurar dependências
dotnet restore

# Compilar
dotnet build

# Executar em desenvolvimento
dotnet run

# Executar com observação de alterações (watch)
dotnet watch run

# Compilar para produção
dotnet publish -c Release

# Limpar ficheiros compilados
dotnet clean
```

### Frontend (Next.js)

```bash
# Navegar até frontend
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Executar versão compilada
npm run start

# Executar linter
npm run lint
```

---

## ⚠️ Resolução de Problemas

### ❌ "Erro: AUTH_USER não está definido no .env"

**Solução**: Certifique-se que criou o ficheiro `backend/.env` com as variáveis:

### ❌ "Erro: 401 Unauthorized na API"

**Solução**: Verifique que as credenciais em `frontend/.env.local` correspondem às de `backend/.env`:

### ❌ "Porta 5282 já está em uso (Backend)"

**Solução**: Mude a porta em `backend/Properties/launchSettings.json`:

```json
"applicationUrl": "http://localhost:5283"
```

E atualize no `frontend/.env.local`


### ❌ "Porta 3000 já está em uso (Frontend)"

**Solução**: Execute o frontend com outra porta:

```bash
npm run dev -- -p 3001
```

### ❌ "Cannot find module 'axios' no Frontend"

**Solução**: Instale as dependências:

```bash
cd frontend
npm install
```

### ❌ ".NET SDK não encontrado"

**Solução**: Instale o [.NET 10 SDK](https://dotnet.microsoft.com/download)

---

## 📚 Stack Tecnológico

### Backend
- **Runtime**: .NET 10
- **Framework**: ASP.NET Core
- **Padrão**: Controllers, Services, Repositories, DTOs
- **Autenticação**: Basic Auth com Middleware
- **API Docs**: Swagger/OpenAPI
- **Banco**: Em memória (pronto para SQL Server/PostgreSQL)

### Frontend
- **Framework**: Next.js 14+
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Drag & Drop**: @hello-pangea/dnd
- **React Version**: 19.2.4

---

## 📖 Documentação Adicional

- [REQUIREMENTS.md](REQUIREMENTS.md) - Todos os requisitos implementados com descrições detalhadas
- [USECASES.md](USECASES.md) - Diagramas de use cases em PlantUML para cada funcionalidade
- [TEST_CASES.md](TEST_CASES.md) - Diagramas de testes feitos para o backend
- [CHANGELOG.md](CHANGELOG.md) - Histórico de versões
- [LICENSE](LICENSE) - Licença do projeto

---

## 🔐 Segurança

> ⚠️ **NUNCA commita os ficheiros `.env` ou `.env.local` para o repositório!**

Estes ficheiros contêm credenciais sensíveis. Devem ser:
1. Criados localmente em cada máquina
2. Adicionados ao `.gitignore`
3. Compartilhados com a equipa de forma segura (ex: 1Password, LastPass, documentação privada)

---

## 📝 Licença

Este projeto está licenciado sob a MIT License - veja o ficheiro [LICENSE](LICENSE) para detalhes.

---

**Versão Atual**: v1.1.0  
**Última Atualização**: 2 de Junho de 2026 
