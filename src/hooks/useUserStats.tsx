
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import type { UserStats, Achievement, Habit } from '../types'
import { toast } from 'react-hot-toast'

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_habit',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro hábito',
    icon: '🎯',
    condition: (stats) => stats.totalHabitsCompleted >= 1
  },
  {
    id: 'streak_7',
    name: 'Semana Forte',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 7
  },
  {
    id: 'level_5',
    name: 'Evoluindo',
    description: 'Alcance o nível 5',
    icon: '⭐',
    condition: (stats) => stats.level >= 5
  },
  {
    id: 'points_1000',
    name: 'Milionário',
    description: 'Acumule 1000 pontos',
    icon: '💎',
    condition: (stats) => stats.totalPoints >= 1000
  },
  {
    id: 'habits_50',
    name: 'Persistente',
    description: 'Complete 50 hábitos',
    icon: '🏆',
    condition: (stats) => stats.totalHabitsCompleted >= 50
  },
  {
    id: 'streak_30',
    name: 'Dedicado',
    description: 'Mantenha uma sequência de 30 dias',
    icon: '👑',
    condition: (stats) => stats.longestStreak >= 30
  }
]

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.getUserStats()
      
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setError(response.error || 'Erro ao carregar estatísticas')
      }
    } catch (err) {
      console.error('Erro ao buscar estatísticas:', err)
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const checkAchievements = (currentStats: UserStats, habits: Habit[] = []) => {
    if (!currentStats) return

    const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
      achievement.condition(currentStats, habits) && 
      !currentStats.achievements.includes(achievement.id)
    )

    unlockedAchievements.forEach(achievement => {
      toast.success(`🏆 Conquista desbloqueada: ${achievement.name}!`, {
        duration: 4000
      })
    })

    if (unlockedAchievements.length > 0) {
      const newAchievements = [
        ...currentStats.achievements,
        ...unlockedAchievements.map(a => a.id)
      ]
      
      setStats(prev => prev ? {
        ...prev,
        achievements: newAchievements
      } : null)
    }
  }

  const getAchievements = (): Achievement[] => {
    if (!stats) return []
    
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: stats.achievements.includes(achievement.id)
    }))
  }

  const getExpProgress = (): number => {
    if (!stats) return 0
    return (stats.currentExp / (stats.currentExp + stats.expToNextLevel)) * 100
  }

  const getNextLevelExp = (): number => {
    if (!stats) return 100
    return stats.currentExp + stats.expToNextLevel
  }

  const getLevelName = (level: number): string => {
    if (level >= 50) return 'Lenda'
    if (level >= 40) return 'Mestre'
    if (level >= 30) return 'Especialista'
    if (level >= 20) return 'Avançado'
    if (level >= 10) return 'Intermediário'
    if (level >= 5) return 'Iniciante'
    return 'Novato'
  }

  const refreshStats = () => {
    fetchStats()
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    isLoading,
    error,
    fetchStats,
    refreshStats,
    checkAchievements,
    getAchievements,
    getExpProgress,
    getNextLevelExp,
    getLevelName
  }
}
