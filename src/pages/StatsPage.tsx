
import { useState, useEffect } from 'react'
import {Calendar, TrendingUp, Award, Target, Flame, Trophy} from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStats } from '../hooks/useUserStats'
import { useHabits } from '../hooks/useHabits'
import { api } from '../utils/api'
import { HABIT_CATEGORIES } from '../types'
import type { HabitCompletion } from '../types'

export default function StatsPage() {
  const { stats, getAchievements, getExpProgress, getLevelName } = useUserStats()
  const { habits } = useHabits()
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Estatísticas - HabitQuest'
    fetchCompletions()
  }, [])

  const fetchCompletions = async () => {
    try {
      const response = await api.getCompletions()
      if (response.success && response.data) {
        setCompletions(response.data)
      }
    } catch (error) {
      console.error('Erro ao buscar conclusões:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const achievements = getAchievements()
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const expProgress = getExpProgress()

  // Estatísticas por categoria
  const categoryStats = Object.entries(HABIT_CATEGORIES).map(([key, category]) => {
    const categoryHabits = habits.filter(h => h.category === key)
    const categoryCompletions = completions.filter(c => 
      categoryHabits.some(h => h.id === c.habitId)
    )
    
    return {
      category: key,
      name: category.name,
      icon: category.icon,
      color: category.color,
      habitsCount: categoryHabits.length,
      completionsCount: categoryCompletions.length,
      totalPoints: categoryCompletions.reduce((sum, c) => sum + c.pointsEarned, 0)
    }
  }).filter(stat => stat.habitsCount > 0)

  // Atividade dos últimos 30 dias
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const dailyActivity = last30Days.map(date => {
    const dayCompletions = completions.filter(c => 
      c.completedAt.split('T')[0] === date
    )
    return {
      date,
      completions: dayCompletions.length,
      points: dayCompletions.reduce((sum, c) => sum + c.pointsEarned, 0)
    }
  })

  const maxDailyCompletions = Math.max(...dailyActivity.map(d => d.completions), 1)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Estatísticas e Progresso
        </h1>
        <p className="text-gray-600">
          Acompanhe sua evolução e conquistas ao longo da jornada
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nível Atual</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.level || 1}</p>
              <p className="text-sm text-gray-500">{getLevelName(stats?.level || 1)}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso para o próximo nível</span>
              <span>{Math.round(expProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="progress-bar h-2"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pontos</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalPoints || 0}</p>
              <p className="text-sm text-gray-500">Acumulados</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maior Sequência</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.longestStreak || 0}</p>
              <p className="text-sm text-gray-500">Dias consecutivos</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Completado</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalHabitsCompleted || 0}</p>
              <p className="text-sm text-gray-500">Hábitos concluídos</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Atividade dos Últimos 30 Dias</span>
          </h2>
          
          <div className="space-y-2">
            {dailyActivity.slice(-7).map((day, index) => (
              <div key={day.date} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600">
                  {new Date(day.date).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit' 
                  })}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(day.completions / maxDailyCompletions) * 100}%` 
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {day.completions > 0 && day.completions}
                  </span>
                </div>
                <div className="w-12 text-xs text-gray-600 text-right">
                  {day.points}p
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Estatísticas por Categoria</span>
          </h2>
          
          <div className="space-y-4">
            {categoryStats.map((stat, index) => (
              <motion.div
                key={stat.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{stat.name}</div>
                    <div className="text-sm text-gray-600">
                      {stat.habitsCount} hábito{stat.habitsCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{stat.completionsCount}</div>
                  <div className="text-sm text-gray-600">{stat.totalPoints}p</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mt-8"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
          <Award className="w-5 h-5" />
          <span>Conquistas</span>
          <span className="text-sm font-normal text-gray-600">
            ({unlockedAchievements.length}/{achievements.length})
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                }`}>
                  <span className="text-2xl">{achievement.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
