
import React from 'react'
import {Star} from 'lucide-react'
import { motion } from 'framer-motion'

interface LevelProgressProps {
  level: number
  currentExp: number
  expToNextLevel: number
  totalPoints: number
}

const LevelProgress: React.FC<LevelProgressProps> = ({ 
  level, 
  currentExp, 
  expToNextLevel, 
  totalPoints 
}) => {
  const progressPercentage = (currentExp / expToNextLevel) * 100

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nível {level}</h2>
            <p className="text-sm text-gray-600">{totalPoints.toLocaleString()} pontos totais</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Próximo nível</p>
          <p className="text-lg font-bold text-blue-600">
            {currentExp}/{expToNextLevel} XP
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progresso para o nível {level + 1}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        
        <div className="progress-bar h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="progress-fill h-full"
          />
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Faltam {expToNextLevel - currentExp} XP para o próximo nível
        </p>
      </div>
    </div>
  )
}

export default LevelProgress
