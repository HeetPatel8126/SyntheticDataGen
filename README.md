# Synthetic Data Generation Platform

A full-stack application for generating realistic synthetic data for testing, development, and demos. Features a modern Next.js frontend with a FastAPI backend.

## 🚀 Features

- **Multiple Data Types**: Generate User/Person, E-commerce transactions, and Company data
- **Flexible Output**: Export as CSV or JSON formats
- **Reproducible Data Runs**: Optional seed support for deterministic generation
- **Locale-Aware Generation**: Generate culturally localized datasets (US, EU, Asia, India, and more)
- **Async Processing**: Large datasets (up to 1M records) processed in background with Celery
- **Progress Tracking**: Real-time job status and progress updates
- **Custom Templates**: Create your own data schemas with custom fields
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Modern Dashboard**: Premium web UI for managing data generation jobs
- **API Key Authentication**: Simple and secure API access
- **Auto Cleanup**: Automatic deletion of old generated files

## 📋 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL
- **Job Queue**: Celery + Redis
- **Data Generation**: Faker library
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local filesystem (S3-ready architecture)

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **State Management**: Zustand
- **API Client**: Axios with React Query

## 🏗️ Project Structure

```
synthetic-data/
├── app/                     # Backend application
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Configuration settings
│   ├── database.py          # Database connection and session
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py        # API endpoints
│   │   ├── auth.py          # Authentication utilities
│   │   └── auth_routes.py   # Auth endpoints (register, login)
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py        # SQLAlchemy models
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── file_service.py  # File management
│   │   ├── job_service.py   # Job management
│   │   └── generators/      # Data generators
│   │       ├── __init__.py
│   │       ├── base.py
│   │       ├── user_generator.py
│   │       ├── ecommerce_generator.py
│   │       ├── company_generator.py
│   │       └── factory.py
│   └── workers/
│       ├── __init__.py
│       ├── celery_app.py    # Celery configuration
│       └── tasks.py         # Background tasks
├── frontend/                # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── dashboard/       # Dashboard pages
│   │   │   ├── generate/    # Data generation page
│   │   │   ├── history/     # Job history page
│   │   │   ├── templates/   # Template management
│   │   │   └── settings/    # User settings
│   │   ├── signin/          # Sign in page
│   │   └── signup/          # Sign up page
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── animations/      # Animation components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities and API client
├── alembic/                 # Database migrations
├── tests/                   # Unit tests
├── generated_data/          # Generated files storage
├── docker-compose.yml       # Docker services
├── Dockerfile
├── install.ps1              # Windows installation script
├── install.sh               # Linux/Mac installation script
├── start.ps1                # Windows quick start script
├── start.sh                 # Linux/Mac quick start script
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Option 1: Quick Install Scripts (Easiest)

**Windows:**
```powershell
# Install dependencies
.\install.ps1

# Start both frontend and backend
.\start.ps1
```

**Linux/Mac:**
```bash
# Install dependencies
./install.sh

# Start both frontend and backend
./start.sh
```

This will:
- Install backend Python dependencies
- Run database migrations
- Install frontend Node.js dependencies
- Start both services (Frontend on port 3000, Backend on port 8000)

### Option 2: Docker Compose (Recommended for Production)

1. **Clone and setup**:
   ```bash
   git clone https://github.com/HeetPatel8126/SyntheticDataGen.git
   cd synthetic-data
   cp .env.example .env
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Flower (Celery Monitor): http://localhost:5555

### Option 3: Manual Local Development

1. **Prerequisites**:
   - Python 3.11+
   - PostgreSQL
   - Redis

2. **Setup**:
   ```bash
   # Clone repository
   git clone <repository>
   cd synthetic-data

   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate

   # Install dependencies
   pip install -r requirements.txt

   # Copy and configure environment
   cp .env.example .env
   # Edit .env with your database and Redis URLs
   ```

3. **Initialize database**:
   ```bash
   # Run migrations
   alembic upgrade head
   ```

4. **Start services** (in separate terminals):
   ```bash
   # Terminal 1: Start API
   uvicorn app.main:app --reload

   # Terminal 2: Start Celery worker
   celery -A app.workers.celery_app worker --loglevel=info

   # Terminal 3 (optional): Start Celery beat for scheduled tasks
   celery -A app.workers.celery_app beat --loglevel=info

   # Terminal 4: Start Frontend
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📖 API Usage

### User Authentication

The platform supports user registration and login with JWT tokens.

#### Register a New User
```bash
POST /auth/register
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "full_name": "John Doe"
}
```

**Response**:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true
  }
}
```

#### Login
```bash
POST /auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

#### Refresh Token
```bash
POST /auth/refresh
```

#### Get Current User
```bash
GET /auth/me
Authorization: Bearer <access_token>
```

### API Key Authentication

All API endpoints (except `/health`) require an API key. Include it in your requests:

```bash
# Via header (recommended)
curl -H "X-API-Key: your-api-key" http://localhost:8000/api/generate

# Via query parameter
curl "http://localhost:8000/api/generate?api_key=your-api-key"
```

Default development API key: `dev-api-key-123456`

### Endpoints

#### Generate Data
```bash
POST /api/generate
```

**Request Body**:
```json
{
  "data_type": "user",       // "user", "ecommerce", or "company"
  "record_count": 10000,     // 100 to 1,000,000
  "output_format": "csv",    // "csv" or "json"
  "locale": "en_US",         // optional, defaults to en_US
  "seed": 2026                // optional, enables deterministic output
}
```

`locale` currently supports: `en_US`, `en_GB`, `fr_FR`, `de_DE`, `es_ES`, `it_IT`, `ja_JP`, `ko_KR`, `zh_CN`, `hi_IN`.

**Response**:
```json
{
  "job_id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Job created successfully. Generating 10000 user records.",
  "status": "pending"
}
```

#### Check Job Status
```bash
GET /api/jobs/{job_id}
```

**Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "processing",
  "progress": 45.5,
  "error_message": null,
  "created_at": "2026-01-22T10:30:00",
  "started_at": "2026-01-22T10:30:01",
  "completed_at": null
}
```

#### Download Generated File
```bash
GET /api/jobs/{job_id}/download
```

Returns the generated CSV or JSON file.

#### List Jobs
```bash
GET /api/jobs?status=completed&page=1&page_size=20
```

#### List Available Data Types
```bash
GET /api/data-types
```

#### List Templates
```bash
GET /api/templates
```

#### Create Custom Template
```bash
POST /api/templates
```

**Request Body**:
```json
{
  "name": "Customer Profile",
  "description": "Custom customer data template",
  "schema_fields": [
    {"name": "id", "field_type": "uuid", "nullable": false},
    {"name": "name", "field_type": "name", "nullable": false},
    {"name": "email", "field_type": "email", "nullable": false},
    {"name": "age", "field_type": "integer", "nullable": false}
  ]
}
```

### Example Workflow

```bash
# 1. Submit generation job
JOB_ID=$(curl -s -X POST "http://localhost:8000/api/generate" \
  -H "X-API-Key: dev-api-key-123456" \
  -H "Content-Type: application/json" \
  -d '{"data_type": "user", "record_count": 10000, "output_format": "csv"}' \
  | jq -r '.job_id')

echo "Job ID: $JOB_ID"

# 2. Poll for status
while true; do
  STATUS=$(curl -s "http://localhost:8000/api/jobs/$JOB_ID" \
    -H "X-API-Key: dev-api-key-123456" \
    | jq -r '.status')
  
  PROGRESS=$(curl -s "http://localhost:8000/api/jobs/$JOB_ID" \
    -H "X-API-Key: dev-api-key-123456" \
    | jq -r '.progress')
  
  echo "Status: $STATUS, Progress: $PROGRESS%"
  
  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    break
  fi
  
  sleep 2
done

# 3. Download the file
curl -o users.csv "http://localhost:8000/api/jobs/$JOB_ID/download" \
  -H "X-API-Key: dev-api-key-123456"

echo "Downloaded users.csv"
```

## 📊 Data Types

### User/Person Data
Fields: id, first_name, last_name, full_name, email, phone, date_of_birth, age, gender, street_address, city, state, postal_code, country, username, job_title, company, salary, created_at, is_active

### E-commerce Transactions
Fields: order_id, transaction_id, customer_id, customer_email, product_id, product_name, product_category, quantity, unit_price, discount_percent, subtotal, tax_amount, shipping_cost, total_amount, currency, payment_method, order_status, shipping_method, shipping_address, order_date, shipped_date, delivered_date

### Company/Business Data
Fields: id, company_name, trading_name, industry, sub_industry, company_type, founded_year, employee_count, size_category, annual_revenue, revenue_growth_percent, market_cap, stock_symbol, stock_exchange, headquarters_address, headquarters_city, headquarters_country, website, email, phone, ceo_name, description, is_active, created_at

## 🧪 Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_generators.py -v
```

## 🔧 Configuration

Environment variables (see `.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://postgres:postgres@localhost:5432/synthetic_data` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `API_KEY` | API authentication key | `dev-api-key-123456` |
| `STORAGE_PATH` | Path for generated files | `./generated_data` |
| `MAX_FILE_AGE_DAYS` | Days before auto-cleanup | `7` |
| `MIN_RECORDS` | Minimum records per job | `100` |
| `MAX_RECORDS` | Maximum records per job | `1000000` |
| `SUPPORTED_LOCALES` | Comma-separated locale list accepted by API requests | `en_US,en_GB,fr_FR,de_DE,es_ES,it_IT,ja_JP,ko_KR,zh_CN,hi_IN` |

## 🔒 Security Notes

- Change the default `API_KEY` and `SECRET_KEY` in production
- Configure CORS appropriately for your deployment
- Use HTTPS in production
- Consider rate limiting for public deployments
- JWT tokens expire after a configurable time; use refresh tokens for long sessions

## 🖥️ Frontend Dashboard

The web dashboard provides a premium user experience for:

- **Data Generation**: Select data type, record count, and output format with real-time previews
- **Job History**: View all past generation jobs with status and download links
- **Custom Templates**: Create and manage custom data schemas with a visual editor
- **User Settings**: Manage account settings and API keys
- **Real-time Progress**: Track job progress with animated UI components

### Screenshots

Access the dashboard at http://localhost:3000 after starting the application.

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pytest`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📚 Additional Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide
- [Frontend README](frontend/README.md) - Frontend-specific documentation
