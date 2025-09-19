
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import type { Habit, HabitFormData } from '../types'
import { toast } from 'react-hot-toast'

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHabits = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await api.getHabits()
      
      if (response.success && response.data) {
        setHabits(response.data)
      } else {
        setError(response.error || 'Erro ao carregar hábitos')
      }
    } catch (err) {
      console.error('Erro ao buscar hábitos:', err)
      setError('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const createHabit = async (habitData: HabitFormData): Promise<boolean> => {
    try {
      const response = await api.createHabit(habitData)
      
      if (response.success && response.data) {
        setHabits(prev => [response.data!, ...prev])
        toast.success('Hábito criado com sucesso!')
        return true
      } else {
        toast.error(response.error || 'Erro ao criar hábito')
        return false
      }
    } catch (error) {
      console.error('Erro ao criar hábito:', error)
      toast.error('Erro interno do servidor')
      return false
    }
  }

  const updateHabit = async (id: number, habitData: Partial<HabitFormData>): Promise<boolean> => {
    try {
      const response = await api.updateHabit(id, habitData)
      
      if (response.success && response.data) {
        setHabits(prev => 
          prev.map(habit => 
            habit.id === id ? response.data! : habit
          )
        )
        toast.success('Hábito atualizado com sucesso!')
        return true
      } else {
        toast.error(response.error || 'Erro ao atualizar hábito')
        return false
      }
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
      toast.error('Erro interno do servidor')
      return false
    }
  }

  const deleteHabit = async (id: number): Promise<boolean> => {
    try {
      const response = await api.deleteHabit(id)
      
      if (response.success) {
        setHabits(prev => prev.filter(habit => habit.id !== id))
        toast.success('Hábito removido com sucesso!')
        return true
      } else {
        toast.error(response.error || 'Erro ao remover hábito')
        return false
      }
    } catch (error) {
      console.error('Erro ao remover hábito:', error)
      toast.error('Erro interno do servidor')
      return false
    }
  }

  const completeHabit = async (id: number, notes?: string): Promise<boolean> => {
    try {
      const response = await api.completeHabit(id, notes)
      
      if (response.success && response.data) {
        const { habit, pointsEarned, levelUp, newLevel } = response.data
        
        // Atualizar o hábito na lista
        setHabits(prev => 
          prev.map(h => h.id === id ? habit : h)
        )
        
        // Notificações de sucesso
        toast.success(`+${pointsEarned} pontos! 🎉`)
        
        if (levelUp && newLevel) {
          toast.success(`Parabéns! Você subiu para o nível ${newLevel}! 🎊`, {
            duration: 4000
          })
        }
        
        return true
      } else {
        toast.error(response.error || 'Erro ao completar hábito')
        return false
      }
    } catch (error) {
      console.error('Erro ao completar hábito:', error)
      toast.error('Erro interno do servidor')
      return false
    }
  }

  const toggleHabitStatus = async (id: number): Promise<boolean> => {
    const habit = habits.find(h => h.id === id)
    if (!habit) return false

    return updateHabit(id, { isActive: !habit.isActive })
  }

  const getHabitsByCategory = (category?: string) => {
    if (!category) return habits
    return habits.filter(habit => habit.category === category)
  }

  const getActiveHabits = () => {
    return habits.filter(habit => habit.isActive)
  }

  const getHabitsCompletedToday = () => {
    const today = new Date().toDateString()
    return habits.filter(habit => {
      // Esta lógica seria melhor implementada no backend
      // Por agora, assumimos que habits com streak > 0 foram completados recentemente
      return habit.streak > 0
    })
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    toggleHabitStatus,
    getHabitsByCategory,
    getActiveHabits,
    getHabitsCompletedToday
  }
}
