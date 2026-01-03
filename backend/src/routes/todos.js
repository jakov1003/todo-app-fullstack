import Todo from '../models/Todo.js'

export default async function todoRoutes(fastify, options) {
  
  // GET all todos
  // URL: http://localhost:3000/api/todos
  fastify.get('/todos', async (request, reply) => {
    try {
      // Get all todos from database
      const todos = await Todo.find().sort({ createdAt: -1 })
      
      // Send them back
      return { success: true, data: todos }
    } catch (error) {
      // If something went wrong, send error
      reply.code(500).send({ 
        success: false, 
        error: error.message 
      })
    }
  })

  // POST create a new todo
  // URL: http://localhost:3000/api/todos
  fastify.post('/todos', async (request, reply) => {
    try {
      // Get data from request body
      const { name, checked } = request.body
      
      // Validate: name is required
      if (!name || name.trim() === '') {
        return reply.code(400).send({ 
          success: false, 
          error: 'Todo name is required' 
        })
      }

      // Create new todo
      const todo = new Todo({
        name: name.trim(),
        checked: checked || false
      })

      // Save to database
      await todo.save()
      
      // Send back the created todo
      return reply.code(201).send({ 
        success: true, 
        data: todo 
      })
    } catch (error) {
      reply.code(500).send({ 
        success: false, 
        error: error.message 
      })
    }
  })

  // PUT update a todo
  // URL: http://localhost:3000/api/todos/:id
  fastify.put('/todos/:id', async (request, reply) => {
    try {
      const { name, checked } = request.body
      
      // Find todo by id and update it
      const todo = await Todo.findByIdAndUpdate(
        request.params.id,
        { 
          ...(name !== undefined && { name: name.trim() }),
          ...(checked !== undefined && { checked })
        },
        { new: true, runValidators: true }
      )

      // If todo doesn't exist
      if (!todo) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Todo not found' 
        })
      }

      return { success: true, data: todo }
    } catch (error) {
      reply.code(500).send({ 
        success: false, 
        error: error.message 
      })
    }
  })

  // DELETE a todo
  // URL: http://localhost:3000/api/todos/:id
  fastify.delete('/todos/:id', async (request, reply) => {
    try {
      // Find and delete the todo
      const todo = await Todo.findByIdAndDelete(request.params.id)

      // If todo doesn't exist
      if (!todo) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Todo not found' 
        })
      }

      return { 
        success: true, 
        message: 'Todo deleted successfully' 
      }
    } catch (error) {
      reply.code(500).send({ 
        success: false, 
        error: error.message 
      })
    }
  })
}