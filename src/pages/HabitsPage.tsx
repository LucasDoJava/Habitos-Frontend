
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {Plus, Search, Filter, Grid, List} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHabits } from '../hooks/useHabits'
import HabitCard from '../components/HabitCard'
import { HABIT_CATEGORIES } from '../types'
import type { Habit } from '../types'

export default function HabitsPage() {
  const { habits, completeHabit, deleteHabit, isLoading } = useHabits()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'streak'>('created')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    document.title = 'Meus Hábitos - HabitQuest'
  }, [])

  const filteredAndSortedHabits = habits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           habit.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || habit.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'streak':
          return b.streak - a.streak
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleDeleteHabit = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este hábito? Esta ação não pode ser desfeita.')) {
      await deleteHabit(id)
    }
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Hábitos
          </h1>
          <p className="text-gray-600">
            Gerencie seus hábitos e acompanhe seu progresso
          </p>
        </div>
        <Link
          to="/add-habit"
          className="btn-primary flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Hábito</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar hábitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field lg:w-48"
          >
            <option value="all">Todas as categorias</option>
            {Object.entries(HABIT_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-field lg:w-48"
          >
            <option value="created">Mais recentes</option>
            <option value="name">Nome A-Z</option>
            <option value="streak">Maior sequência</option>
          </select>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Visualização em grade"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Visualização em lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        {(searchTerm || selectedCategory !== 'all') && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              Mostrando {filteredAndSortedHabits.length} de {habits.length} hábitos
            </span>
            {searchTerm && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                {HABIT_CATEGORIES[selectedCategory as keyof typeof HABIT_CATEGORIES]?.name}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Habits Grid/List */}
      {filteredAndSortedHabits.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredAndSortedHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <HabitCard
                  habit={habit}
                  onComplete={completeHabit}
                  onDelete={handleDeleteHabit}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Nenhum hábito encontrado' 
              : 'Nenhum hábito criado ainda'
            }
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Tente ajustar os filtros para encontrar seus hábitos.'
              : 'Comece sua jornada criando seu primeiro hábito!'
            }
          </p>
          {searchTerm || selectedCategory !== 'all' ? (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="btn-secondary"
            >
              Limpar filtros
            </button>
          ) : (
            <Link to="/add-habit" className="btn-primary">
              Criar Primeiro Hábito
            </Link>
          )}
        </motion.div>
      )}

      {/* Stats Summary */}
      {habits.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{habits.length}</div>
            <div className="text-sm text-gray-600">Total de hábitos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {habits.filter(h => h.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Ativos</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.max(...habits.map(h => h.streak), 0)}
            </div>
            <div className="text-sm text-gray-600">Maior sequência</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {habits.reduce((sum, h) => sum + h.totalCompletions, 0)}
            </div>
            <div className="text-sm text-gray-600">Total completado</div>
          </div>
        </div>
      )}
    </div>
  )
}
