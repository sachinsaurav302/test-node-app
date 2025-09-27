# =========================
# Stage 1: Build Stage
# =========================
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Run build (for React/Vue/Angular or transpile step in Node.js)
# RUN npm run build

# =========================
# Stage 2: Runtime Stage
# =========================
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built app from builder (sirf source code / dist)
COPY --from=builder /app ./

# Expose port
EXPOSE 5050

# Start command
CMD ["node", "server.js"]
