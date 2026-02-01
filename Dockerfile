# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Type check
RUN npm run typecheck

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev for tsx)
RUN npm ci

# Copy built application from builder stage
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 8081

# Start the application
CMD ["npm", "run", "dev"]
