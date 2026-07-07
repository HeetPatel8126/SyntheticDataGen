# SyntheticDataGen
 
> Privacy-safe synthetic data, generated on demand — from 100 to 1,000,000 records, with zero real PII ever touched.
 
**SyntheticDataGen** is a full-stack platform for teams who need realistic test, dev, and demo data without the compliance risk, procurement delay, or manual scrubbing of production databases. Submit a job, watch it process in real time, and download clean CSV/JSON — through a dashboard or a single API call.
 
---
 
## The Problem
 
Every engineering team eventually hits the same wall:
 
- **Production data is off-limits.** GDPR, HIPAA, and internal data-governance policies mean real customer records can't sit in a staging environment, a QA pipeline, or a hackathon demo.
- **Scrubbing real data is slow and still risky.** Anonymization pipelines are brittle, re-identification is a known failure mode, and someone still has to maintain them.
- **Hand-written fixtures don't scale.** A dozen hardcoded test users don't surface the edge cases that a real, varied dataset would — and nobody wants to write 10,000 rows by hand.
- **Every team rebuilds this.** Data generation scripts get rewritten from scratch in nearly every codebase because there's no shared, reusable service for it.
## The Solution
 
SyntheticDataGen is infrastructure teams plug into instead of reinventing: a self-serve API and dashboard that generates realistic, statistically varied data at any scale, with **no real records in the loop at any point** — so there is nothing to leak, anonymize, or audit for compliance.
 
- **No privacy risk by construction** — data is generated, not derived from real records, so there's no re-identification surface and no memorization risk (a real failure mode in approaches that fine-tune models on real customer data to "look realistic").
- **Self-serve, not ticket-driven** — QA, dev, and data teams get data through the dashboard or API instead of filing a request and waiting on a DBA.
- **Scales from a laptop demo to a load test** — 100 records for a quick prototype, 1,000,000 for a real stress test, same interface.
- **Extensible schema, not a fixed dataset** — custom templates let teams define exactly the fields and shapes they need, beyond the built-in data types.
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
 
> Categorical fields (industries, sub-industries, job titles, etc.) currently draw from a curated internal dictionary. **Coming next:** an LLM-assisted dictionary-expansion pass that periodically enriches these pools with a wider, more realistic spread of values — generated offline, validated, and merged in, with no real data or per-record LLM calls in the runtime path. This keeps generation throughput untouched while meaningfully increasing category diversity.
 
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
- No real user data is ever ingested, stored, or used as a generation source — the platform has no path by which real PII could leak into synthetic output
---
 
## Roadmap
 
- [ ] LLM-assisted dictionary expansion for categorical fields (offline batch job, no runtime LLM dependency)
- [ ] Additional data type domains (healthcare, finance/fintech, IoT/sensor data)
- [ ] Correlated-field generation (e.g. company size ↔ revenue ↔ employee count consistency)
- [ ] Differential-privacy-aware generation mode for teams needing formal privacy guarantees
- [ ] Public hosted version with usage-based pricing for teams that don't want to self-host
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