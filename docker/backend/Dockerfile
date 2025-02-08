# docker/backend/Dockerfile

# Use Node.js LTS version as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install Python and other dependencies required for node-gyp
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]