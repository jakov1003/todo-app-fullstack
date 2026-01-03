// API base URL - where your backend is
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// TypeScript type for a Todo (matches your app)
export interface Todo {
  id: string
  name: string
  checked: boolean
  createdAt?: string
}

// API response wrapper
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// API service - all methods to talk to backend
export const api = {
  // Get all todos
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_URL}/todos`)
      const data: ApiResponse<Todo[]> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch todos')
      }
      
      return data.data || []
    } catch (error) {
      console.error('Error fetching todos:', error)
      throw error
    }
  },

  // Create a new todo
  async createTodo(name: string, checked: boolean = false): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, checked })
      })
      
      const data: ApiResponse<Todo> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to create todo')
      }
      
      return data.data
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  },

  // Update a todo
  async updateTodo(id: string, updates: { name?: string; checked?: boolean }): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })
      
      const data: ApiResponse<Todo> = await response.json()
      
      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to update todo')
      }
      
      return data.data
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  },

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE'
      })
      
      const data: ApiResponse<never> = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete todo')
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }
}