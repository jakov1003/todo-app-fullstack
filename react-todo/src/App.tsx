import { useState, useEffect } from 'react'

// Import API service
import { api, type Todo } from './services/api'

// Custom components
import CustomForm from './components/CustomForm'
import EditForm from './components/EditForm'
import TaskList from './components/TaskList'

function App() {
  // State
  const [tasks, setTasks] = useState<Todo[]>([])
  const [previousFocusEl, setPreviousFocusEl] = useState<HTMLElement | null>(null)
  const [editedTask, setEditedTask] = useState<Todo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load todos from backend when app starts
  useEffect(() => {
    loadTodos()
  }, [])

  // Function to load todos from backend
  const loadTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.getTodos()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos')
      console.error('Failed to load todos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Add a new task
  const addTask = async (task: { name: string; checked: boolean }) => {
    try {
      setError(null)
      // Create todo on backend
      const newTodo = await api.createTodo(task.name, task.checked)
      // Add to state
      setTasks(prevState => [...prevState, newTodo])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo')
      console.error('Failed to add todo:', err)
    }
  }

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      setError(null)
      // Delete from backend
      await api.deleteTodo(id)
      // Remove from state
      setTasks(prevState => prevState.filter(t => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo')
      console.error('Failed to delete todo:', err)
    }
  }

  // Toggle task checked state
  const toggleTask = async (id: string) => {
    try {
      setError(null)
      // Find the task
      const task = tasks.find(t => t.id === id)
      if (!task) return
      
      // Update on backend
      const updated = await api.updateTodo(id, { checked: !task.checked })
      // Update in state
      setTasks(prevState => prevState.map(t => (t.id === id ? updated : t)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo')
      console.error('Failed to toggle todo:', err)
    }
  }

  // Update task name
  const updateTask = async (task: Todo) => {
    try {
      setError(null)
      // Update on backend
      const updated = await api.updateTodo(task.id, { name: task.name })
      // Update in state
      setTasks(prevState => prevState.map(t => (t.id === task.id ? updated : t)))
      closeEditMode()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo')
      console.error('Failed to update todo:', err)
    }
  }

  const closeEditMode = () => {
    setIsEditing(false)
    if (previousFocusEl) {
      previousFocusEl.focus()
    }
  }

  const enterEditMode = (task: Todo) => {
    setEditedTask(task)
    setIsEditing(true)
    setPreviousFocusEl(document.activeElement as HTMLElement)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container">
        <header>
          <h1>My Todo App</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading todos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>My Todo App</h1>
      </header>

      {/* Show error if any */}
      {error && (
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          color: '#c33',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Error: {error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#c33'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Edit form modal */}
      {isEditing && editedTask && (
        <EditForm
          editedTask={editedTask}
          updateTask={updateTask}
          closeEditMode={closeEditMode}
        />
      )}

      {/* Add todo form */}
      <CustomForm addTask={addTask} />

      {/* Todo list */}
      {tasks && (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          enterEditMode={enterEditMode}
        />
      )}
    </div>
  )
}

export default App