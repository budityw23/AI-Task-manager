# Task Management Application Backend

A Node.js backend service for the Task Management Application with AI prioritization.

## Project Structure
```bash
backend/
├── dist/               # Compiled TypeScript output
├── prisma/            # Prisma ORM configurations
│   └── schema.prisma  # Database schema definition
├── scripts/           # Database scripts
├── src/               # Source code
│   ├── database/      # Database related code
│   │   ├── prisma.ts  # Prisma client configuration
│   │   └── transaction.ts # Database transactions
│   └── index.ts       # Main application entry point
├── .env.example       # Example environment variables template
├── .env.development   # Development environment variables
├── .env.test          # Test environment variables
├── .env.production    # Production environment variables
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies and scripts

frontend/
├── src/              # Source code
├── public/           # Static files
├── vite.config.ts    # Vite configuration
└── package.json      # Project dependencies and scripts

docker/
├── backend/          # Backend Docker configurations
│   └── Dockerfile    # Backend container definition
└── frontend/         # Frontend Docker configurations
    └── Dockerfile    # Frontend container definition
```

## Environment Setup

### 1. Environment Files
Copy `.env.example` and create environment-specific files:

```bash
# Create development environment file
cp .env.example .env.development

# Create test environment file
cp .env.example .env.test

# Create production environment file
cp .env.example .env.production
```

### 2. Configure Environment Variables

Each environment file contains specific configurations:

#### Development (.env.development)
```env
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskmanagement
JWT_SECRET=dev_secret_key
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=http://localhost:5173
```

#### Test (.env.test)
```env
NODE_ENV=test
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskmanagement_test
JWT_SECRET=test_secret_key
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=http://localhost:5173
```

#### Production (.env.production)
```env
NODE_ENV=production
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=strong_password_here
DB_NAME=taskmanagement_prod
JWT_SECRET=strong_production_secret_key
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=https://your-production-domain.com
```

## Running the Application

### Development Environment
```bash
# Start the development environment
docker-compose up --build

# Stop the development environment
docker-compose down

# Stop and remove volumes (clean start)
docker-compose down -v
```

### Test Environment
```bash
# Start the test environment
NODE_ENV=test docker-compose up --build

# Stop the test environment
docker-compose down

# Run with volume cleanup
docker-compose down -v && NODE_ENV=test docker-compose up --build
```

### Production Environment
```bash
# Start the production environment
NODE_ENV=production docker-compose up --build

# Stop the production environment
docker-compose down

# Run with volume cleanup
docker-compose down -v && NODE_ENV=production docker-compose up --build
```

## Database Operations

### Database Access

Connect to PostgreSQL database:

```bash
# Connect to development database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement

# Connect to test database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement_test

# Connect to production database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement_prod
```

### Database Testing

To work with the test database:

1. Apply migrations to test database:
```bash
# Run inside the backend container
docker-compose exec backend sh -c "NODE_ENV=test npx prisma migrate deploy"
```

2. Test database connection:
```bash
# Test the database connection and basic operations
curl -X GET http://localhost:3000/api/test/test-db
```

3. Verify test database setup:
```bash
# Connect to test database and verify tables
docker exec -it ai-task-manager-postgres_test-1 psql -U postgres -d taskmanagement_test -c "\dt"
```

Common PostgreSQL commands:
```sql
-- List all tables
\dt

-- Describe specific table
\d table_name

-- List all indexes
\di

-- List all custom types
\dT+
```

## Environment Variables Description

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Current environment | development/test/production |
| PORT | Application port | 3000 |
| DB_HOST | Database host | postgres |
| DB_PORT | Database port | 5432 |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | postgres |
| DB_NAME | Database name | taskmanagement |
| JWT_SECRET | JWT signing key | your_secret_key |
| OPENAI_API_KEY | OpenAI API key | your_api_key |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## Important Notes

1. Never commit `.env.*` files to version control
2. Always use strong passwords in production
3. Change default JWT secrets in production
4. Use proper CORS configuration in production
5. Regularly backup production database

## Frontend Environment Setup

### Development Mode
Update the frontend service in docker-compose.yml:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: ../docker/frontend/Dockerfile
    target: development  # Specify development stage
  ports:
    - "5173:5173"
  volumes:
    - ./frontend:/usr/src/app
    - /usr/src/app/node_modules
  environment:
    - NODE_ENV=development
  command: npm run dev
```

### Production Mode
Update the frontend service in docker-compose.yml:
```yaml
frontend:
  build:
    context: ./frontend
    dockerfile: ../docker/frontend/Dockerfile
    target: production  # Specify production stage
  ports:
    - "80:80"
  environment:
    - NODE_ENV=production
```

### Running Different Environments

1. Development:
```bash
# Ensure frontend service in docker-compose.yml is set to development target
docker-compose up --build
```

2. Production:
```bash
# Ensure frontend service in docker-compose.yml is set to production target
docker-compose up --build
```

### Important Notes for Frontend
- Development mode runs on port 5173 with hot-reloading enabled
- Production mode runs on port 80 using NGINX to serve static files
- Changes between modes require updating the `target` in docker-compose.yml and rebuilding
- Always rebuild when switching environments: `docker-compose up --build`

## Network Configuration and Health Checks

### Network Structure
The application uses three isolated networks:
- `frontend-network`: Frontend to Backend communication
- `backend-network`: Backend service communications
- `database-network`: Database access

### Check Network Status
```bash
# List all networks
docker network ls

# Inspect specific networks
docker network inspect ai-task-manager_frontend-network
docker network inspect ai-task-manager_backend-network
docker network inspect ai-task-manager_database-network

# Check container network connectivity
docker exec -it ai-task-manager-backend-1 ping postgres
docker exec -it ai-task-manager-frontend-1 ping backend
```

### Health Checks

#### Database Health Check
PostgreSQL container includes a health check that verifies database availability:
```bash
# Check PostgreSQL container health status
docker inspect --format='{{json .State.Health}}' ai-task-manager-postgres-1

# View PostgreSQL container logs
docker logs ai-task-manager-postgres-1

# Manual health check
docker exec -it ai-task-manager-postgres-1 pg_isready -U postgres
```

### Network Troubleshooting

If services can't communicate:

1. Verify networks are created:
```bash
docker network ls | grep ai-task-manager
```

2. Check container network attachment:
```bash
# List networks for each container
docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{printf "%s\n" $k}}{{end}}' ai-task-manager-backend-1
docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{printf "%s\n" $k}}{{end}}' ai-task-manager-frontend-1
docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{printf "%s\n" $k}}{{end}}' ai-task-manager-postgres-1
```

3. Reset networking (if issues persist):
```bash
# Remove all containers and networks
docker-compose down

# Remove all networks
docker network prune

# Rebuild and start
docker-compose up --build
```

### Important Network Security Notes
1. Frontend can only communicate with backend
2. Only backend can access database
3. Database is isolated from frontend
4. Internal ports are not exposed unless necessary
5. Use secure passwords for database in production