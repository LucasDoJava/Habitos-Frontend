
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Plus, TrendingUp, Target, Flame, Trophy, Calendar} from 'lucide-react'
import { motion } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'
import { useUserStats } from '../hooks/useUserStats'
import HabitCard from '../components/HabitCard'

export default function Dashboard() {
  const { habits, completeHabit, isLoading: habitsLoading } = useHabits()
  const { stats, getAchievements, getExpProgress, getLevelName, isLoading: statsLoading } = useUserStats()

  const activeHabits = habits.filter(habit => habit.isActive)
  const recentHabits = activeHabits.slice(0, 3)
  const achievements = getAchievements()
  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const expProgress = getExpProgress()

  useEffect(() => {
    document.title = 'Dashboard - HabitQuest'
  }, [])

  if (habitsLoading || statsLoading) {
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
          Dashboard
        </h1>
        <p className="text-gray-600">
          Acompanhe seu progresso e continue sua jornada de transformação
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
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
          transition={{ delay: 0.2 }}
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
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hábitos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{activeHabits.length}</p>
              <p className="text-sm text-gray-500">Em progresso</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maior Sequência</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.longestStreak || 0}</p>
              <p className="text-sm text-gray-500">Dias consecutivos</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Habits */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Hábitos Recentes</h2>
            <Link
              to="/add-habit"
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Hábito</span>
            </Link>
          </div>

          {recentHabits.length > 0 ? (
            <div className="space-y-4">
              {recentHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <HabitCard
                    habit={habit}
                    onComplete={completeHabit}
                    showActions={false}
                  />
                </motion.div>
              ))}
              
              <div className="text-center pt-4">
                <Link
                  to="/habits"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todos os hábitos →
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-8 text-center"
            >
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum hábito criado ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Comece sua jornada criando seu primeiro hábito!
              </p>
              <Link to="/add-habit" className="btn-primary">
                Criar Primeiro Hábito
              </Link>
            </motion.div>
          )}
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Conquistas</h2>
          
          <div className="space-y-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`card p-4 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}>
                    <span className="text-xl">{achievement.icon}</span>
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
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            <div className="text-center pt-2">
              <Link
                to="/stats"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Ver todas as conquistas →
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 card p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Resumo Rápido</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Conquistas desbloqueadas</span>
                <span className="font-semibold">{unlockedAchievements.length}/{achievements.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total completado</span>
                <span className="font-semibold">{stats?.totalHabitsCompleted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Próximo nível em</span>
                <span className="font-semibold">{stats?.expToNextLevel || 100} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
