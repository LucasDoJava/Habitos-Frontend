
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Sequelize, DataTypes } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(helmet())
app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

// Configuração do banco de dados
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_URL || 'database.sqlite',
  logging: false, // Desabilitar logs SQL em produção
  // Para MySQL no futuro, descomente e configure:
  // dialect: 'mysql',
  // host: process.env.DB_HOST || 'localhost',
  // port: process.env.DB_PORT || 3306,
  // database: process.env.DB_NAME || 'habit_gamification',
  // username: process.env.DB_USER || 'root',
  // password: process.env.DB_PASSWORD || '',
})

// Modelos de dados
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
})

const Habit = sequelize.define('Habit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  category: {
    type: DataTypes.ENUM('saude', 'produtividade', 'exercicio', 'estudo', 'social', 'outro'),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.ENUM('facil', 'medio', 'dificil'),
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  bestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalCompletions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'habits',
  timestamps: true
})

const HabitCompletion = sequelize.define('HabitCompletion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  habitId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Habit,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  streakDay: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'habit_completions',
  timestamps: true
})

const UserStats = sequelize.define('UserStats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id'
    }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  totalPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currentExp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  expToNextLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    validate: {
      min: 0
    }
  },
  achievements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  longestStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalHabitsCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'user_stats',
  timestamps: true
})

// Associações
User.hasMany(Habit, { foreignKey: 'userId' })
Habit.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(HabitCompletion, { foreignKey: 'userId' })
HabitCompletion.belongsTo(User, { foreignKey: 'userId' })

Habit.hasMany(HabitCompletion, { foreignKey: 'habitId' })
HabitCompletion.belongsTo(Habit, { foreignKey: 'habitId' })

User.hasOne(UserStats, { foreignKey: 'userId' })
UserStats.belongsTo(User, { foreignKey: 'userId' })

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token de acesso requerido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'habit-secret-key')
    const user = await User.findByPk(decoded.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuário não encontrado' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido' })
  }
}

// Função para calcular nível e experiência
const calculateLevel = (totalPoints) => {
  const level = Math.floor(totalPoints / 100) + 1
  const currentExp = totalPoints % 100
  const expToNextLevel = 100 - currentExp
  return { level, currentExp, expToNextLevel }
}

// Função para atualizar estatísticas do usuário
const updateUserStats = async (userId, pointsToAdd = 0) => {
  try {
    let stats = await UserStats.findOne({ where: { userId } })
    
    if (!stats) {
      stats = await UserStats.create({ userId })
    }

    if (pointsToAdd > 0) {
      stats.totalPoints += pointsToAdd
      stats.totalHabitsCompleted += 1
      
      const { level, currentExp, expToNextLevel } = calculateLevel(stats.totalPoints)
      const oldLevel = stats.level
      stats.level = level
      stats.currentExp = currentExp
      stats.expToNextLevel = expToNextLevel
      
      // Verificar se subiu de nível
      const levelUp = level > oldLevel
      
      await stats.save()
      return { stats, levelUp, newLevel: level }
    }
    
    await stats.save()
    return { stats, levelUp: false }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error)
    return { stats: null, levelUp: false }
  }
}

// ROTAS DE AUTENTICAÇÃO

// Registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email já está em uso' 
      })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Criar usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // Criar estatísticas iniciais
    await updateUserStats(user.id)

    // Gerar token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'habit-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Encontrar usuário
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      })
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      })
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'habit-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }
      }
    })
  } catch (error) {
    console.error('Erro no login:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Perfil do usuário
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    })
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// ROTAS DE HÁBITOS

// Listar hábitos do usuário
app.get('/api/habits', authenticateToken, async (req, res) => {
  try {
    const habits = await Habit.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    })
    
    res.json({
      success: true,
      data: habits,
    })
  } catch (error) {
    console.error('Erro ao buscar hábitos:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Buscar hábito específico
app.get('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const habit = await Habit.findOne({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    })
    
    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hábito não encontrado' 
      })
    }

    res.json({
      success: true,
      data: habit,
    })
  } catch (error) {
    console.error('Erro ao buscar hábito:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Criar novo hábito
app.post('/api/habits', authenticateToken, async (req, res) => {
  try {
    const habitData = {
      ...req.body,
      userId: req.user.id,
      points: req.body.difficulty === 'facil' ? 10 : 
              req.body.difficulty === 'medio' ? 20 : 30
    }

    const habit = await Habit.create(habitData)

    res.status(201).json({
      success: true,
      data: habit,
      message: 'Hábito criado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao criar hábito:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Atualizar hábito
app.put('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const [updatedRows] = await Habit.update(req.body, {
      where: { id: req.params.id, userId: req.user.id }
    })

    if (updatedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hábito não encontrado' 
      })
    }

    const habit = await Habit.findByPk(req.params.id)

    res.json({
      success: true,
      data: habit,
      message: 'Hábito atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro ao atualizar hábito:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Deletar hábito
app.delete('/api/habits/:id', authenticateToken, async (req, res) => {
  try {
    const deletedRows = await Habit.destroy({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    })

    if (deletedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hábito não encontrado' 
      })
    }

    // Deletar também as conclusões relacionadas
    await HabitCompletion.destroy({ where: { habitId: req.params.id } })

    res.json({
      success: true,
      message: 'Hábito removido com sucesso',
    })
  } catch (error) {
    console.error('Erro ao deletar hábito:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Completar hábito
app.post('/api/habits/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body
    const habit = await Habit.findOne({ 
      where: { 
        id: req.params.id, 
        userId: req.user.id 
      }
    })

    if (!habit) {
      return res.status(404).json({ 
        success: false, 
        message: 'Hábito não encontrado' 
      })
    }

    // Verificar se já foi completado hoje
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingCompletion = await HabitCompletion.findOne({
      where: {
        habitId: habit.id,
        userId: req.user.id,
        completedAt: {
          [Sequelize.Op.gte]: today,
          [Sequelize.Op.lt]: tomorrow
        }
      }
    })

    if (existingCompletion) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hábito já foi completado hoje' 
      })
    }

    // Criar conclusão
    const completion = await HabitCompletion.create({
      habitId: habit.id,
      userId: req.user.id,
      pointsEarned: habit.points,
      notes,
      streakDay: habit.streak + 1,
    })

    // Atualizar estatísticas do hábito
    habit.streak += 1
    habit.bestStreak = Math.max(habit.bestStreak, habit.streak)
    habit.totalCompletions += 1
    await habit.save()

    // Atualizar estatísticas do usuário
    const { stats, levelUp, newLevel } = await updateUserStats(req.user.id, habit.points)

    res.json({
      success: true,
      data: {
        completion,
        habit,
        pointsEarned: habit.points,
        levelUp,
        newLevel,
        stats,
      },
      message: 'Hábito completado com sucesso!',
    })
  } catch (error) {
    console.error('Erro ao completar hábito:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// ROTAS DE ESTATÍSTICAS

// Estatísticas do usuário
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    let stats = await UserStats.findOne({ where: { userId: req.user.id } })
    
    if (!stats) {
      const { stats: newStats } = await updateUserStats(req.user.id)
      stats = newStats
    }

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// Histórico de conclusões
app.get('/api/completions', authenticateToken, async (req, res) => {
  try {
    const { habitId } = req.query
    const whereClause = { userId: req.user.id }
    
    if (habitId) {
      whereClause.habitId = habitId
    }

    const completions = await HabitCompletion.findAll({
      where: whereClause,
      include: [{
        model: Habit,
        attributes: ['name', 'icon', 'color']
      }],
      order: [['completedAt', 'DESC']],
      limit: 50
    })

    res.json({
      success: true,
      data: completions,
    })
  } catch (error) {
    console.error('Erro ao buscar conclusões:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    })
  }
})

// ROTA DE SAÚDE
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Servidor funcionando!', 
    timestamp: new Date().toISOString() 
  })
})

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error)
  res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor' 
  })
})

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Rota não encontrada' 
  })
})

// Inicializar banco de dados e servidor
const startServer = async () => {
  try {
    // Sincronizar modelos com o banco
    await sequelize.sync({ force: false }) // Altere para true apenas para recriar tabelas
    console.log('✅ Banco de dados sincronizado')
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`)
      console.log(`📊 API disponível em http://localhost:${PORT}/api`)
      console.log(`💾 Banco: SQLite (database.sqlite)`)
    })
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error)
    process.exit(1)
  }
}

startServer()
