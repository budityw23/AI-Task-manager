# Use Node.js 18 with Alpine Linux as the base image (Alpine is lightweight)
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install required system dependencies:
# - python3: Required for some npm packages that need compilation
# - make & g++: Required for building native modules
# - openssl: Required for security features
RUN apk add --no-cache python3 make g++ openssl

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
# Copy TypeScript configuration
COPY tsconfig.json ./
# Copy Prisma schema and configurations
COPY prisma ./prisma/

# Install all dependencies
RUN npm install
# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .
# Build the TypeScript application
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]