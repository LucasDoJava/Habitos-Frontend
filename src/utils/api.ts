
import type { 
  User, 
  Habit, 
  HabitCompletion, 
  UserStats, 
  AuthResponse, 
  ApiResponse,
  HabitFormData,
  LoginFormData,
  RegisterFormData
} from '../types'

const API_BASE_URL = 'http://localhost:3001/api'

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }
    }
  }

  // Autenticação
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const response = await this.request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.token)
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      }
    }

    return {
      success: false,
      message: response.error || 'Erro no login'
    }
  }

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    const response = await this.request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    if (response.success && response.data) {
      localStorage.setItem('auth_token', response.data.token)
      return {
        success: true,
        token: response.data.token,
        user: response.data.user
      }
    }

    return {
      success: false,
      message: response.error || 'Erro no registro'
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile')
  }

  logout() {
    localStorage.removeItem('auth_token')
  }

  // Hábitos
  async getHabits(): Promise<ApiResponse<Habit[]>> {
    return this.request<Habit[]>('/habits')
  }

  async getHabit(id: number): Promise<ApiResponse<Habit>> {
    return this.request<Habit>(`/habits/${id}`)
  }

  async createHabit(habitData: HabitFormData): Promise<ApiResponse<Habit>> {
    return this.request<Habit>('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData)
    })
  }

  async updateHabit(id: number, habitData: Partial<HabitFormData>): Promise<ApiResponse<Habit>> {
    return this.request<Habit>(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData)
    })
  }

  async deleteHabit(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/habits/${id}`, {
      method: 'DELETE'
    })
  }

  async completeHabit(
    id: number, 
    notes?: string
  ): Promise<ApiResponse<{
    completion: HabitCompletion
    habit: Habit
    pointsEarned: number
    levelUp: boolean
    newLevel?: number
    stats: UserStats
  }>> {
    return this.request(`/habits/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes })
    })
  }

  // Estatísticas
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.request<UserStats>('/stats')
  }

  async getCompletions(habitId?: number): Promise<ApiResponse<HabitCompletion[]>> {
    const query = habitId ? `?habitId=${habitId}` : ''
    return this.request<HabitCompletion[]>(`/completions${query}`)
  }

  // Saúde da API
  async checkHealth(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    return this.request<{ message: string; timestamp: string }>('/health')
  }
}

export const api = new ApiClient()
export default api
