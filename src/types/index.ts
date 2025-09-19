
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Habit {
  id: number
  userId: number
  name: string
  description: string
  category: 'saude' | 'produtividade' | 'exercicio' | 'estudo' | 'social' | 'outro'
  difficulty: 'facil' | 'medio' | 'dificil'
  points: number
  streak: number
  bestStreak: number
  totalCompletions: number
  isActive: boolean
  icon: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface HabitCompletion {
  id: number
  habitId: number
  userId: number
  completedAt: string
  pointsEarned: number
  notes?: string
  streakDay: number
  createdAt: string
  updatedAt: string
  habit?: Habit
}

export interface UserStats {
  id: number
  userId: number
  level: number
  totalPoints: number
  currentExp: number
  expToNextLevel: number
  achievements: string[]
  longestStreak: number
  totalHabitsCompleted: number
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: UserStats, habits: Habit[]) => boolean
  unlocked?: boolean
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface HabitFormData {
  name: string
  description: string
  category: Habit['category']
  difficulty: Habit['difficulty']
  icon: string
  color: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface DashboardStats {
  totalHabits: number
  activeHabits: number
  completedToday: number
  currentStreak: number
  totalPoints: number
  level: number
  expProgress: number
  recentCompletions: HabitCompletion[]
  topHabits: Habit[]
}

export interface CategoryStats {
  category: string
  count: number
  points: number
  completions: number
  color: string
}

export const HABIT_CATEGORIES = {
  saude: { name: 'Saúde', icon: '🏥', color: 'text-green-600' },
  produtividade: { name: 'Produtividade', icon: '⚡', color: 'text-blue-600' },
  exercicio: { name: 'Exercício', icon: '💪', color: 'text-orange-600' },
  estudo: { name: 'Estudo', icon: '📚', color: 'text-purple-600' },
  social: { name: 'Social', icon: '👥', color: 'text-pink-600' },
  outro: { name: 'Outro', icon: '📝', color: 'text-gray-600' }
} as const

export const DIFFICULTY_SETTINGS = {
  facil: { name: 'Fácil', points: 10, color: 'text-green-600' },
  medio: { name: 'Médio', points: 20, color: 'text-yellow-600' },
  dificil: { name: 'Difícil', points: 30, color: 'text-red-600' }
} as const

export const HABIT_ICONS = [
  '💪', '🏃', '📚', '💧', '🧘', '🥗', '😴', '🎯',
  '✍️', '🎨', '🎵', '🌱', '💻', '📱', '🏠', '🚶',
  '🧠', '❤️', '⏰', '📝', '🎪', '🌟', '🔥', '⚡'
] as const

export const HABIT_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#C026D3', '#DB2777',
  '#E11D48', '#64748B', '#6B7280', '#374151'
] as const
