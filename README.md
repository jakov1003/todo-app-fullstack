# What is in this repository?

A full-stack todo application built with React, Fastify, MongoDB, and Docker.

# Method

I transcribed the app code from the [Modern React CRUD App Project (React ToDo app)](https://www.youtube.com/watch?v=7u2Rv4HfCYQ) video.

Subsequently, I built the backend, connected it to MongoDB, and containerized the app by working with Claude AI. The video only covered the frontend part.

I am not a programmer, nor am I aiming to become one. This project was a test of my technical abilities and problem-solving skills (since transcription can breed errors), with the ultimate goal of learning how a React frontend and Fastify backend integrate with MongoDB.

I had zero prior React or Fastify experience with minimal knowledge of non-relational databases and Docker.

## Technologies Used

**Frontend:**
- React 19
- TypeScript
- Vite
- pnpm

**Backend:**
- Node.js
- Fastify
- Mongoose (MongoDB ODM)
- npm

**Database:**
- MongoDB 7

**Containerization & Deployment:**
- Docker
- Docker Compose
- Nginx

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Git](https://git-scm.com/downloads)

## How To Start the Application

### 1. Clone the repository
```bash
git clone https://github.com/jakov1003/todo-app-fullstack.git
cd todo-app-fullstack
```

### 2. Run the Docker containers
```bash
docker-compose up --build
```

Wait for all containers to start (about 1-2 minutes first time).

### 3. Access the application

Open your browser and visit:
```
http://localhost
```
- do not use 127.0.0.1 instead of http://localhost

**Backend API:** http://localhost:3000/api/todos  
**Health check:** http://localhost:3000/health

## Stopping the Application

Press `Ctrl+C` in the terminal, then:
```bash
docker-compose down
```

## Project Structure
```
todo-app-fullstack/
├── backend/              # Fastify backend API
│   ├── src/
│   │   ├── index.js      # Main server file
│   │   ├── models/       # MongoDB models
│   │   └── routes/       # API routes
│   ├── Dockerfile
│   └── package.json
│
├── react-todo/           # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API service layer
│   │   └── App.tsx       # Main app component
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
└── docker-compose.yml    # Docker orchestration
```
### Environment Variables

The application uses these environment variables (configured in `docker-compose.yml`):

**Backend:**
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend:**
- `VITE_API_URL` - Backend API URL

## Database

**Access MongoDB:**

MongoDB Compass connection string:
```
mongodb://localhost:27018/todo-app
```

Using mongosh (command line):
```bash
docker exec -it todo-mongodb mongosh todo-app
```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /health` - Health check endpoint
