import Fastify from 'fastify'
import cors from '@fastify/cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import todoRoutes from './routes/todos.js'

// Load settings from .env file
dotenv.config()

// Create Fastify server
const fastify = Fastify({
  logger: true  // Show logs in console
})

// Connect to MongoDB database
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todo-app'
    
    await mongoose.connect(mongoUri)
    
    console.log('✅ Connected to MongoDB!')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1) // Stop the server if can't connect to database
  }
}

// Enable CORS (let React app talk to this server)
await fastify.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',  // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
})

// Register todo routes (the menu of what server can do)
await fastify.register(todoRoutes, { prefix: '/api' })

// Health check route (to test if server is running)
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'ok',
    message: 'Server is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  }
})

// Root route (just for testing)
fastify.get('/', async (request, reply) => {
  return { 
    message: 'Todo API Server',
    endpoints: {
      health: '/health',
      todos: '/api/todos'
    }
  }
})

// Start the server!
const start = async () => {
  try {
    // First, connect to database
    await connectDB()

    // Then start the server
    const port = process.env.PORT || 3000
    await fastify.listen({ port, host: '0.0.0.0' })
    
    console.log(`🚀 Server is running on http://localhost:${port}`)
    console.log(`📋 API endpoints: http://localhost:${port}/api/todos`)
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

// Start everything!
start()