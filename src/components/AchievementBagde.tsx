import React from 'react'
import {Trophy, Target, Flame, Star, Award, Crown} from 'lucide-react'
import { motion } from 'framer-motion'

interface AchievementBadgeProps {
  achievementId: string
  unlocked?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievementId, 
  unlocked = false,
  size = 'md' 
}) => {
  const achievements: Record<string, { name: string; description: string; icon: any; color: string }> = {
    'first_completion': {
      name: 'Primeiro Passo',
      description: 'Complete seu primeiro hábito',
      icon: Target,
      color: 'from-green-400 to-emerald-500'
    },
    'habit_explorer': {
      name: 'Explorador de Hábitos',
      description: 'Complete 10 hábitos',
      icon: Trophy,
      color: 'from-blue-400 to-blue-500'
    },
    'habit_master': {
      name: 'Mestre dos Hábitos',
      description: 'Complete 50 hábitos',
      icon: Crown,
      color: 'from-purple-400 to-purple-500'
    },
    'level_5': {
      name: 'Nível 5',
      description: 'Alcance o nível 5',
      icon: Star,
      color: 'from-yellow-400 to-orange-500'
    },
    'level_10': {
      name: 'Nível 10',
      description: 'Alcance o nível 10',
      icon: Award,
      color: 'from-red-400 to-pink-500'
    },
    'week_warrior': {
      name: 'Guerreiro da Semana',
      description: 'Mantenha uma sequência de 7 dias',
      icon: Flame,
      color: 'from-orange-400 to-red-500'
    }
  }

  const achievement = achievements[achievementId]
  if (!achievement) return null

  const Icon = achievement.icon

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative ${unlocked ? 'cursor-pointer' : 'cursor-default'}`}
      title={unlocked ? `${achievement.name}: ${achievement.description}` : 'Conquista bloqueada'}
    >
      <div className={`
        ${sizes[size]} rounded-full flex items-center justify-center shadow-lg transition-all duration-300
        ${unlocked 
          ? `bg-gradient-to-br ${achievement.color} shadow-glow` 
          : 'bg-gray-200 grayscale'
        }
      `}>
        <Icon className={`${iconSizes[size]} ${unlocked ? 'text-white' : 'text-gray-400'}`} />
      </div>
      
      {unlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      )}
    </motion.div>
  )
}

export default AchievementBadge
