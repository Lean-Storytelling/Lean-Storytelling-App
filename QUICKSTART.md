# Quickstart Guide

## Prerequisites

- Node.js v20 or higher
- PostgreSQL 15 or higher
- Docker (optional, for containerized deployment)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/lean-storytelling-app.git
cd lean-storytelling-app
```

### 2. Set up the backend

```bash
cd backend
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection details and other configuration.

### 4. Set up the database

The application uses PostgreSQL. You can:

- Use an existing PostgreSQL instance
- Run PostgreSQL in Docker:

```bash
docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_USER=youruser -e POSTGRES_DB=leanstorytelling -p 5432:5432 -d postgres:15
```

### 5. Run database migrations

```bash
cd backend
node src/db/migrate.js
```

### 6. Start the backend server

```bash
npm start
```

The backend will start on `http://localhost:3000`

### 7. Set up the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port specified in your configuration).

## Using Docker (Alternative)

### 1. Build and start containers

```bash
docker-compose up --build
```

This will start both the backend and frontend services.

### 2. Run migrations

```bash
docker-compose exec backend node src/db/migrate.js
```

## Development

For development with hot-reloading:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user profile
- `POST /api/stories` - Create a new story
- `GET /api/stories` - List stories
- `GET /api/stories/:id` - Get story details
- `POST /api/stories/:id/versions` - Create a new version
- `GET /api/stories/:id/versions` - List versions
- `POST /api/stories/:id/deliveries` - Create a delivery
- `GET /api/stories/:id/deliveries` - List deliveries
- `POST /api/feedbacks` - Submit feedback

## Testing

Run tests with:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Troubleshooting

- **Database connection issues**: Verify your PostgreSQL credentials in `.env` and that the database is running
- **Port conflicts**: Make sure ports 3000 (backend) and 5173 (frontend) are available
- **Migration errors**: Check that your database user has proper permissions to create tables

## Next Steps

- Explore the API documentation
- Check out the contribution guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)
- Join our community and ask questions