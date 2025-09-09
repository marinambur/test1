FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci since we don't have lock file)
RUN npm install --only=production

# Copy source code
COPY . .

# Install dev dependencies for build
RUN npm install

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose default port (Railway will set PORT env var at runtime)
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:prod"] 
