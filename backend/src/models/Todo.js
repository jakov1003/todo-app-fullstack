import mongoose from 'mongoose'

// This describes what a todo looks like to MongoDB
const todoSchema = new mongoose.Schema({
  name: {
    type: String,        // The todo text (e.g., "Buy milk")
    required: true,      // Must have a name
    trim: true,          // Remove extra spaces
    maxlength: 60        // Match your React app's maxLength
  },
  checked: {
    type: Boolean,       // Is it completed? true/false
    default: false       // Start as not checked
  },
  createdAt: {
    type: Date,          // When was it created?
    default: Date.now    // Automatically set to now
  }
}, {
  timestamps: true,
  versionKey: false       // Automatically adds createdAt and updatedAt
})

// Convert MongoDB's _id to id (to match your React app)
todoSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()  // MongoDB uses _id, your React app uses id
    delete ret._id               // Remove _id
    delete ret.__v               // Remove version key
    return ret
  }
})

// Export the model
export default mongoose.model('Todo', todoSchema)