
# 🎯 HabitQuest - Aplicativo de Gamificação de Hábitos

Um aplicativo completo para gamificar seus hábitos diários com sistema de pontos, níveis, conquistas e estatísticas detalhadas. **Versão local com Node.js e SQLite/MySQL**.

## ✨ Funcionalidades

### 🎮 Sistema de Gamificação
- **Pontuação**: Ganhe pontos ao completar hábitos
- **Níveis**: Suba de nível conforme acumula experiência
- **Sequências**: Mantenha sequências consecutivas de dias
- **Conquistas**: Desbloqueie badges especiais

### 📊 Gerenciamento de Hábitos
- **CRUD Completo**: Criar, visualizar, editar e remover hábitos
- **Categorias**: Organize por saúde, produtividade, exercício, estudo, social
- **Dificuldades**: Fácil (10 pts), Médio (20 pts), Difícil (30 pts)
- **Personalização**: Escolha ícones e cores para cada hábito

### 📈 Estatísticas e Análises
- **Dashboard**: Visão geral do progresso
- **Gráficos**: Estatísticas por categoria
- **Histórico**: Acompanhe atividades recentes
- **Métricas**: Sequências, pontos totais, nível atual

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Interface de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **React Router** - Navegação
- **React Hot Toast** - Notificações
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados local (padrão)
- **Sequelize** - ORM para banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança
- **Morgan** - Logs de requisições

### 🔮 Migração para MySQL (Futuro)
O projeto está preparado para migrar facilmente para MySQL:
- Sequelize ORM suporta múltiplos bancos
- Configuração via variáveis de ambiente
- Modelos compatíveis com MySQL

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clonar e Instalar Dependências
```bash
# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar configurações no arquivo .env (opcional para SQLite)
DATABASE_URL=database.sqlite
JWT_SECRET=sua-chave-secreta-muito-segura-aqui
PORT=3001
```

### 3. Executar Aplicação
```bash
# Executar frontend e backend simultaneamente
npm start

# Ou executar separadamente:
# Backend
npm run server:dev

# Frontend (em outro terminal)
npm run dev
```

### 4. Acessar Aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

## 📁 Estrutura do Projeto

```
habit-gamification-local/
├── src/                          # Frontend React
│   ├── components/               # Componentes reutilizáveis
│   │   ├── AuthForm.tsx         # Formulário de login/registro
│   │   ├── HabitCard.tsx        # Card de hábito
│   │   └── Navbar.tsx           # Navegação principal
│   ├── hooks/                   # Hooks customizados
│   │   ├── useAuth.ts           # Autenticação
│   │   ├── useHabits.ts         # Gerenciamento de hábitos
│   │   └── useUserStats.ts      # Estatísticas do usuário
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Dashboard.tsx        # Página principal
│   │   ├── HabitsPage.tsx       # Lista de hábitos
│   │   ├── AddHabitPage.tsx     # Criar hábito
│   │   └── StatsPage.tsx        # Estatísticas
│   ├── types/                   # Definições TypeScript
│   ├── utils/                   # Utilitários
│   │   └── api.ts               # Cliente API
│   └── App.tsx                  # Componente principal
├── server/                      # Backend Node.js
│   └── index.js                 # Servidor Express
├── database.sqlite              # Banco SQLite (criado automaticamente)
├── package.json                 # Dependências e scripts
└── README.md                    # Documentação
```

## 🎯 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Hábitos
- `GET /api/habits` - Listar hábitos
- `POST /api/habits` - Criar hábito
- `GET /api/habits/:id` - Buscar hábito
- `PUT /api/habits/:id` - Atualizar hábito
- `DELETE /api/habits/:id` - Remover hábito
- `POST /api/habits/:id/complete` - Completar hábito

### Estatísticas
- `GET /api/stats` - Estatísticas do usuário
- `GET /api/completions` - Histórico de conclusões

## 💾 Banco de Dados

### SQLite (Padrão)
- **Arquivo**: `database.sqlite` (criado automaticamente)
- **Vantagens**: Zero configuração, perfeito para desenvolvimento local
- **Localização**: Raiz do projeto

### Migração para MySQL
Para migrar para MySQL no futuro, edite o arquivo `.env`:

```env
# Descomente e configure para MySQL:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=habit_gamification
DB_USER=root
DB_PASSWORD=sua_senha
```

E no arquivo `server/index.js`, altere a configuração do Sequelize:

```javascript
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})
```

### Estrutura das Tabelas

#### users
```sql
id (INTEGER, PK, AUTO_INCREMENT)
name (VARCHAR(100), NOT NULL)
email (VARCHAR(255), UNIQUE, NOT NULL)
password (VARCHAR(255), NOT NULL)
avatar (VARCHAR(255), NULLABLE)
createdAt (DATETIME)
updatedAt (DATETIME)
```

#### habits
```sql
id (INTEGER, PK, AUTO_INCREMENT)
userId (INTEGER, FK -> users.id)
name (VARCHAR(100), NOT NULL)
description (TEXT)
category (ENUM: saude, produtividade, exercicio, estudo, social, outro)
difficulty (ENUM: facil, medio, dificil)
points (INTEGER, 1-100)
streak (INTEGER, DEFAULT 0)
bestStreak (INTEGER, DEFAULT 0)
totalCompletions (INTEGER, DEFAULT 0)
isActive (BOOLEAN, DEFAULT true)
icon (VARCHAR(255))
color (VARCHAR(255))
createdAt (DATETIME)
updatedAt (DATETIME)
```

#### habit_completions
```sql
id (INTEGER, PK, AUTO_INCREMENT)
habitId (INTEGER, FK -> habits.id)
userId (INTEGER, FK -> users.id)
completedAt (DATETIME, DEFAULT NOW)
pointsEarned (INTEGER, NOT NULL)
notes (TEXT)
streakDay (INTEGER)
createdAt (DATETIME)
updatedAt (DATETIME)
```

#### user_stats
```sql
id (INTEGER, PK, AUTO_INCREMENT)
userId (INTEGER, UNIQUE, FK -> users.id)
level (INTEGER, DEFAULT 1)
totalPoints (INTEGER, DEFAULT 0)
currentExp (INTEGER, DEFAULT 0)
expToNextLevel (INTEGER, DEFAULT 100)
achievements (JSON, DEFAULT [])
longestStreak (INTEGER, DEFAULT 0)
totalHabitsCompleted (INTEGER, DEFAULT 0)
createdAt (DATETIME)
updatedAt (DATETIME)
```

## 🔒 Segurança

### Autenticação
- **JWT Tokens**: Tokens seguros com expiração de 7 dias
- **Hash de Senhas**: bcrypt com 12 salt rounds
- **Middleware de Auth**: Proteção de rotas privadas

### Validação
- **Sequelize Validation**: Validação de dados no ORM
- **Input Sanitization**: Validação de entrada
- **CORS**: Configurado para permitir frontend
- **Helmet**: Headers de segurança HTTP

## 🎨 Recursos de Design

### Paleta de Cores
- **Primária**: Azul (#3B82F6) e Roxo (#8B5CF6)
- **Sucesso**: Verde (#10B981)
- **Atenção**: Amarelo (#F59E0B)
- **Perigo**: Vermelho (#EF4444)
- **Neutro**: Cinza (#6B7280)

### Componentes de UI
- **Cards**: Design moderno com sombras e bordas arredondadas
- **Botões**: Gradientes e efeitos hover
- **Formulários**: Campos com foco visual aprimorado
- **Navegação**: Menu responsivo com indicadores ativos

### Animações
- **Framer Motion**: Transições suaves entre páginas
- **Hover Effects**: Interações visuais nos componentes
- **Loading States**: Indicadores de carregamento

## 🎯 Funcionalidades Futuras

### Planejadas
- [ ] **Lembretes**: Notificações push para hábitos
- [ ] **Social**: Compartilhar progresso com amigos
- [ ] **Relatórios**: Exportar dados em PDF
- [ ] **Temas**: Modo escuro e claro
- [ ] **Backup**: Exportar/importar dados
- [ ] **Widgets**: Componentes para dashboard personalizado

### Melhorias Técnicas
- [ ] **MySQL**: Migração para banco MySQL
- [ ] **Performance**: Otimização de queries
- [ ] **Mobile**: App nativo React Native
- [ ] **PWA**: Progressive Web App
- [ ] **Analytics**: Métricas avançadas
- [ ] **I18n**: Suporte a múltiplos idiomas

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Iniciar frontend (Vite)
npm run server:dev       # Iniciar backend (nodemon)
npm start               # Iniciar ambos simultaneamente

# Produção
npm run build           # Build do frontend
npm run preview         # Preview do build
npm run server          # Iniciar backend em produção

# Utilitários
npm run lint            # Verificar código
```

## 🐛 Solução de Problemas

### Erro: "Database locked"
```bash
# Feche todos os processos que possam estar usando o banco
# Ou delete o arquivo database.sqlite para recriá-lo
rm database.sqlite
npm run server:dev
```

### Erro: "Port already in use"
```bash
# Altere a porta no arquivo .env
PORT=3002
```

### Erro: "Module not found"
```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- 🐛 Issues: GitHub Issues
- 📖 Docs: README.md
- 💬 Discussões: GitHub Discussions

---

**Desenvolvido com ❤️ para ajudar você a construir hábitos melhores!**

### 🎉 Pronto para usar!

Agora você tem um aplicativo completo de gamificação de hábitos rodando localmente com:
- ✅ Frontend React moderno e responsivo
- ✅ Backend Node.js/Express robusto
- ✅ Banco SQLite (sem configuração)
- ✅ Sistema de autenticação JWT
- ✅ Gamificação completa (pontos, níveis, conquistas)
- ✅ Preparado para migrar para MySQL no futuro

Execute `npm start` e comece sua jornada de transformação! 🚀
