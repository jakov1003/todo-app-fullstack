# ============================================
# Stage 1: Build the React app
# ============================================
FROM node:20-alpine AS build

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including dev, needed for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app (creates /dist folder with optimized files)
RUN pnpm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine

# Copy built files from build stage to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (standard HTTP port)
EXPOSE 80

# Nginx starts automatically (default CMD)