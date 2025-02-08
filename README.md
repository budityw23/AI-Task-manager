```markdown
# Task Management Application Backend

A Node.js backend service for the Task Management Application with AI prioritization.

## Project Structure
```bash
backend/
├── .env.example           # Example environment variables template
├── .env.development      # Development environment variables
├── .env.test            # Test environment variables
├── .env.production      # Production environment variables
├── index.js             # Main application file
└── package.json         # Project dependencies and scripts
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

## Database Access

Connect to PostgreSQL database:

```bash
# Connect to development database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement

# Connect to test database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement_test

# Connect to production database
docker exec -it ai-task-manager-postgres-1 psql -U postgres -d taskmanagement_prod
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

```