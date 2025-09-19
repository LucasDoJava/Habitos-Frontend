
import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { api } from '../utils/api'
import type { User, LoginFormData, RegisterFormData } from '../types'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginFormData) => Promise<boolean>
  register: (userData: RegisterFormData) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await api.getProfile()
        
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          localStorage.removeItem('auth_token')
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await api.login(credentials)

      if (response.success && response.user) {
        setUser(response.user)
        toast.success('Login realizado com sucesso!')
        return true
      } else {
        toast.error(response.message || 'Erro no login')
        return false
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro interno do servidor')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterFormData): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      if (userData.password !== userData.confirmPassword) {
        toast.error('As senhas não coincidem')
        return false
      }

      const response = await api.register(userData)

      if (response.success && response.user) {
        setUser(response.user)
        toast.success('Conta criada com sucesso!')
        return true
      } else {
        toast.error(response.message || 'Erro no registro')
        return false
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      toast.error('Erro interno do servidor')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    api.logout()
    setUser(null)
    toast.success('Logout realizado com sucesso!')
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
}
