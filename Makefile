.PHONY: help dev build down logs clean test migrate seed install lint format

# Default target
help:
	@echo "Tunicoin Development Commands"
	@echo "=============================="
	@echo ""
	@echo "  make dev        - Start all services in development mode"
	@echo "  make build      - Build all Docker images"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - View logs from all services"
	@echo "  make clean      - Remove all containers, volumes, and images"
	@echo "  make test       - Run all tests"
	@echo "  make migrate    - Run database migrations"
	@echo "  make seed       - Seed database with demo data"
	@echo "  make install    - Install dependencies for all apps"
	@echo "  make lint       - Run linters"
	@echo "  make format     - Format code"
	@echo ""

# Start all services in development mode
dev:
	@echo "🚀 Starting Tunicoin development environment..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo ""
	@echo "📍 Access points:"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   API Docs:  http://localhost:8000/docs"
	@echo "   PgAdmin:   http://localhost:5050"
	@echo ""
	@echo "📝 Run 'make logs' to view logs"
	@echo "📝 Run 'make migrate' to initialize database"
	@echo "📝 Run 'make seed' to add demo data"

# Build all Docker images
build:
	@echo "🏗️  Building Docker images..."
	docker-compose build
	@echo "✅ Build complete!"

# Stop all services
down:
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped!"

# View logs from all services
logs:
	docker-compose logs -f

# View logs for specific service
logs-web:
	docker-compose logs -f web

logs-api:
	docker-compose logs -f api

logs-worker:
	docker-compose logs -f worker

logs-db:
	docker-compose logs -f postgres

# Clean everything (containers, volumes, images)
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "✅ Cleanup complete!"

# Run database migrations
migrate:
	@echo "🔄 Running database migrations..."
	docker-compose exec api alembic upgrade head
	@echo "✅ Migrations complete!"

# Seed database with demo data
seed:
	@echo "🌱 Seeding database with demo data..."
	docker-compose exec api python -m app.scripts.seed
	@echo "✅ Database seeded!"

# Install dependencies for all apps
install:
	@echo "📦 Installing frontend dependencies..."
	cd apps/web && npm install
	@echo "📦 Installing backend dependencies..."
	cd apps/api && pip install -r requirements.txt
	@echo "📦 Installing worker dependencies..."
	cd apps/worker && pip install -r requirements.txt
	@echo "📦 Installing agent dependencies..."
	cd apps/agent && pip install -e .
	@echo "✅ All dependencies installed!"

# Run all tests
test:
	@echo "🧪 Running tests..."
	@echo "Frontend tests..."
	cd apps/web && npm test
	@echo "Backend tests..."
	docker-compose exec api pytest
	@echo "✅ All tests passed!"

# Run linters
lint:
	@echo "🔍 Running linters..."
	@echo "Frontend (ESLint)..."
	cd apps/web && npm run lint
	@echo "Backend (Ruff)..."
	cd apps/api && ruff check .
	@echo "✅ Linting complete!"

# Format code
format:
	@echo "✨ Formatting code..."
	@echo "Frontend (Prettier)..."
	cd apps/web && npm run format
	@echo "Backend (Black)..."
	cd apps/api && black .
	@echo "✅ Formatting complete!"

# Create new migration
migration:
	@echo "📝 Creating new migration..."
	@read -p "Migration message: " msg; \
	docker-compose exec api alembic revision --autogenerate -m "$$msg"
	@echo "✅ Migration created!"

# Database shell
db-shell:
	docker-compose exec postgres psql -U tunicoin -d tunicoin

# Redis CLI
redis-cli:
	docker-compose exec redis redis-cli

# API shell (Python)
api-shell:
	docker-compose exec api python

# Restart specific service
restart-web:
	docker-compose restart web

restart-api:
	docker-compose restart api

restart-worker:
	docker-compose restart worker

# View service status
status:
	docker-compose ps

# Prune Docker system
prune:
	@echo "🧹 Pruning Docker system..."
	docker system prune -f
	@echo "✅ Pruning complete!"

# Production build
prod-build:
	@echo "🏭 Building production images..."
	docker-compose -f docker-compose.prod.yml build
	@echo "✅ Production build complete!"

# Initialize project (first time setup)
init:
	@echo "🎬 Initializing Tunicoin project..."
	@echo "📦 Step 1: Installing dependencies..."
	@$(MAKE) install
	@echo "🏗️  Step 2: Building Docker images..."
	@$(MAKE) build
	@echo "🚀 Step 3: Starting services..."
	@$(MAKE) dev
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@echo "🔄 Step 4: Running migrations..."
	@$(MAKE) migrate
	@echo "🌱 Step 5: Seeding database..."
	@$(MAKE) seed
	@echo ""
	@echo "✅ Tunicoin is ready!"
	@echo ""
	@echo "📍 Access points:"
	@echo "   Frontend:  http://localhost:3000"
	@echo "   API Docs:  http://localhost:8000/docs"
	@echo "   PgAdmin:   http://localhost:5050"
	@echo ""
	@echo "🎉 Happy coding!"
