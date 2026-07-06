# Synthetic Data Generation Platform

> Generate realistic, privacy-safe synthetic data for testing, development, and demos — from 100 to 1,000,000 records at a time.

A full-stack application with a **FastAPI** backend and **Next.js** frontend. Submit a generation job, track progress in real time, and download your data as CSV or JSON.

---

## Why Synthetic Data?

- **No privacy risk** — Test with realistic data without touching real PII or worrying about GDPR/HIPAA.
- **Instant test data** — Generate thousands to millions of records on demand instead of scrubbing production databases.
- **Unblocks dev & QA** — Teams self-serve the data they need through the dashboard or API.
- **Catches real bugs** — Varied, realistic data surfaces edge cases that hand-crafted fixtures miss.
- **Reusable everywhere** — Seed data for any project, demo, hackathon, or CI pipeline.

---

## Features

| Feature | Description |
|---------|-------------|
| **Multiple Data Types** | User/Person, E-commerce transactions, Company/Business data |
| **Flexible Output** | Export as CSV or JSON |
| **Async Processing** | Large datasets processed in background via Celery + Redis |
| **Progress Tracking** | Real-time job status and progress updates |
| **Custom Templates** | Define your own data schemas with a visual editor |
| **Authentication** | JWT-based auth (register, login, refresh) + API key access |
| **Modern Dashboard** | Premium Next.js UI for managing everything |
| **Auto Cleanup** | Old generated files are deleted automatically |

---

## Tech Stack

### Backend
- **FastAPI** (Python 3.11+) — API framework
- **PostgreSQL** — Primary database
- **Celery + Redis** — Async job queue
- **Faker** — Realistic data generation
- **JWT** — Authentication tokens
- **Alembic** — Database migrations

### Frontend
- **Next.js 14+** (App Router) — React framework
- **Tailwind CSS + shadcn/ui** — Styling & components
- **Framer Motion** — Animations
- **Monaco Editor** — Code/schema editing
- **Recharts** — Data visualization
- **Zustand** — State management
- **Axios + React Query** — API layer

---

## Quick Start

### Option 1: Install Scripts (Easiest)

**Windows:**
```powershell
.\install.ps1    # Install dependencies
.\start.ps1      # Start frontend + backend
```

**Linux / Mac:**
```bash
./install.sh     # Install dependencies
./start.sh       # Start frontend + backend
```

### Option 2: Docker Compose (Recommended for Production)

```bash
git clone https://github.com/HeetPatel8126/SyntheticDataGen.git
cd synthetic-data
cp .env.example .env
docker-compose up -d
```

### Option 3: Manual Setup

```bash
# Backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Edit with your DB and Redis URLs
alembic upgrade head

# Start services (separate terminals)
uvicorn app.main:app --reload
celery -A app.workers.celery_app worker --loglevel=info

# Frontend
cd frontend
npm install
npm run dev
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Flower (Celery) | http://localhost:5555 |

---

## API Usage

All API endpoints (except `/health`) require authentication. Include your API key as a header or query parameter:

```bash
# Header (recommended)
curl -H "X-API-Key: your-api-key" http://localhost:8000/api/generate

# Query parameter
curl "http://localhost:8000/api/generate?api_key=your-api-key"
```

Default dev key: `dev-api-key-123456`

### Generate Data

```bash
POST /api/generate
```
```json
{
  "data_type": "user",
  "record_count": 10000,
  "output_format": "csv"
}
```

### Check Job Status

```bash
GET /api/jobs/{job_id}
```
```json
{
  "id": "123e4567-...",
  "status": "processing",
  "progress": 45.5
}
```

### Download Result

```bash
GET /api/jobs/{job_id}/download
```

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/jobs` | List all jobs (filterable by status) |
| `GET` | `/api/data-types` | List available data types |
| `GET` | `/api/templates` | List custom templates |
| `POST` | `/api/templates` | Create a custom template |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/auth/me` | Get current user profile |

### Example Workflow

```bash
# 1. Submit job
JOB_ID=$(curl -s -X POST "http://localhost:8000/api/generate" \
  -H "X-API-Key: dev-api-key-123456" \
  -H "Content-Type: application/json" \
  -d '{"data_type": "user", "record_count": 10000, "output_format": "csv"}' \
  | jq -r '.job_id')

# 2. Poll status
curl -s "http://localhost:8000/api/jobs/$JOB_ID" -H "X-API-Key: dev-api-key-123456"

# 3. Download
curl -o users.csv "http://localhost:8000/api/jobs/$JOB_ID/download" -H "X-API-Key: dev-api-key-123456"
```

---

## Data Types

### User / Person
`id`, `first_name`, `last_name`, `full_name`, `email`, `phone`, `date_of_birth`, `age`, `gender`, `street_address`, `city`, `state`, `postal_code`, `country`, `username`, `job_title`, `company`, `salary`, `created_at`, `is_active`

### E-commerce Transactions
`order_id`, `transaction_id`, `customer_id`, `customer_email`, `product_id`, `product_name`, `product_category`, `quantity`, `unit_price`, `discount_percent`, `subtotal`, `tax_amount`, `shipping_cost`, `total_amount`, `currency`, `payment_method`, `order_status`, `shipping_method`, `shipping_address`, `order_date`, `shipped_date`, `delivered_date`

### Company / Business
`id`, `company_name`, `trading_name`, `industry`, `sub_industry`, `company_type`, `founded_year`, `employee_count`, `size_category`, `annual_revenue`, `revenue_growth_percent`, `market_cap`, `stock_symbol`, `stock_exchange`, `headquarters_address`, `headquarters_city`, `headquarters_country`, `website`, `email`, `phone`, `ceo_name`, `description`, `is_active`, `created_at`

---

## Configuration

Key environment variables (see `.env.example` for the full list):

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `API_KEY` | API authentication key | `dev-api-key-123456` |
| `SECRET_KEY` | JWT signing secret | — |
| `STORAGE_PATH` | Generated files directory | `./generated_data` |
| `MAX_FILE_AGE_DAYS` | Auto-cleanup threshold | `7` |
| `MIN_RECORDS` | Minimum records per job | `100` |
| `MAX_RECORDS` | Maximum records per job | `1000000` |

---

## Project Structure

```
synthetic-data/
├── app/                        # Backend (FastAPI)
│   ├── main.py                 # Application entry point
│   ├── config.py               # Settings & env vars
│   ├── database.py             # DB connection
│   ├── api/                    # Routes & auth
│   ├── models/                 # SQLAlchemy models
│   ├── schemas/                # Pydantic schemas
│   ├── services/               # Business logic & generators
│   └── workers/                # Celery tasks
├── frontend/                   # Frontend (Next.js)
│   ├── app/                    # App router pages
│   ├── components/             # React components
│   ├── hooks/                  # Custom hooks
│   └── lib/                    # API client & utils
├── alembic/                    # Database migrations
├── tests/                      # Unit tests
├── generated_data/             # Output files
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

---

## Testing

```bash
pytest                          # Run all tests
pytest --cov=app tests/         # With coverage
pytest tests/test_generators.py -v  # Specific file
```

---

## Security Notes

- Change default `API_KEY` and `SECRET_KEY` in production
- Configure CORS for your deployment domain
- Use HTTPS in production
- Rate limiting is enabled by default
- JWT tokens expire after a configurable duration; use refresh tokens for long sessions

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes and run tests (`pytest`)
4. Commit and push (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Documentation

- [SETUP.md](SETUP.md) — Detailed setup instructions
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production deployment guide
- [Frontend README](frontend/README.md) — Frontend-specific docs

## License

MIT License
