
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {ArrowLeft, Save} from 'lucide-react'
import { motion } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'
import { HABIT_CATEGORIES, DIFFICULTY_SETTINGS, HABIT_ICONS, HABIT_COLORS } from '../types'
import type { HabitFormData } from '../types'

export default function AddHabitPage() {
  const navigate = useNavigate()
  const { createHabit } = useHabits()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    category: 'saude',
    difficulty: 'facil',
    icon: '🎯',
    color: '#3B82F6'
  })

  const [errors, setErrors] = useState<Partial<HabitFormData>>({})

  useEffect(() => {
    document.title = 'Criar Hábito - HabitQuest'
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<HabitFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const success = await createHabit(formData)
      if (success) {
        navigate('/habits')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof HabitFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Hábito</h1>
          <p className="text-gray-600">Defina um novo hábito para sua jornada de transformação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Hábito *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Ex: Beber 2 litros de água"
                    maxLength={100}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`input-field resize-none ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Descreva o que você quer alcançar com este hábito..."
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.description ? (
                      <p className="text-red-500 text-sm">{errors.description}</p>
                    ) : (
                      <div />
                    )}
                    <span className="text-gray-500 text-sm">
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Difficulty */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categoria e Dificuldade</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input-field"
                  >
                    {Object.entries(HABIT_CATEGORIES).map(([key, category]) => (
                      <option key={key} value={key}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dificuldade
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="input-field"
                  >
                    {Object.entries(DIFFICULTY_SETTINGS).map(([key, difficulty]) => (
                      <option key={key} value={key}>
                        {difficulty.name} (+{difficulty.points} pontos)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Customization */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personalização Visual</h2>
              
              <div className="space-y-6">
                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Ícone
                  </label>
                  <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
                    {HABIT_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleInputChange('icon', icon)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all duration-200 ${
                          formData.icon === icon
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cor
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {HABIT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleInputChange('color', color)}
                        className={`w-8 h-8 rounded-lg transition-all duration-200 ${
                          formData.color === color
                            ? 'ring-2 ring-gray-400 ring-offset-2'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Criando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Criar Hábito</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div>
          <div className="card p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pré-visualização</h2>
            
            <motion.div
              key={`${formData.icon}-${formData.color}-${formData.name}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="border-2 border-gray-200 rounded-xl p-4"
              style={{ borderLeftColor: formData.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${formData.color}20` }}
                >
                  {formData.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {formData.name || 'Nome do hábito'}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {formData.description || 'Descrição do hábito'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  DIFFICULTY_SETTINGS[formData.difficulty].color
                } bg-current bg-opacity-10`}>
                  {DIFFICULTY_SETTINGS[formData.difficulty].name}
                </span>
                <span className="font-semibold text-gray-700">
                  +{DIFFICULTY_SETTINGS[formData.difficulty].points} pontos
                </span>
              </div>
            </motion.div>

            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2">
                <strong>Categoria:</strong> {HABIT_CATEGORIES[formData.category].name}
              </p>
              <p>
                <strong>Pontos por conclusão:</strong> {DIFFICULTY_SETTINGS[formData.difficulty].points}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
