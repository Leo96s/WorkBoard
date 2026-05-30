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
│   │   └── types/                # TypeScript interfaces
│   ├── .env.local                # ⚠️ FICHEIRO CRÍTICO (não incluído no git)
│   ├── package.json              # Dependências npm
│   ├── next.config.ts            # Configuração Next.js
│   └── tsconfig.json             # Configuração TypeScript
│
├── REQUIREMENTS.md               # Requisitos do projeto
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

**Versão Atual**: v0.3.0  
**Última Atualização**: 30 de Maio de 2026 
