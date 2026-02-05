# Deployment Guide - Synthetic Data Generation Platform

This guide covers deploying the Synthetic Data Generation Platform to production.

## Architecture Overview

- **Frontend:** Next.js application (static + SSR)
- **Backend:** FastAPI application
- **Database:** PostgreSQL
- **Cache/Queue:** Redis + Celery
- **Storage:** File system or S3 for generated data

## Recommended Stack

### Frontend: Vercel (Recommended)
- Native Next.js support
- Automatic deployments from Git
- Global CDN
- Free tier available

### Backend: Railway / Render / DigitalOcean
- Docker support
- Auto-scaling
- Database hosting
- Background workers

### Alternative: Full Docker Deployment
- Deploy everything with docker-compose
- Self-hosted on VPS (AWS EC2, DigitalOcean, etc.)

---

## Option 1: Vercel + Railway (Recommended)

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Configure environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
     ```
   - Deploy!

3. **Custom Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update DNS records

### Backend Deployment (Railway)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   
3. **Add PostgreSQL Database**
   - Click "New" -> "Database" -> "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Add Redis**
   - Click "New" -> "Database" -> "Redis"
   - Railway will automatically set `REDIS_URL`

5. **Configure Environment Variables**
   ```
   DATABASE_URL=postgresql://...  (auto-set)
   REDIS_URL=redis://...          (auto-set)
   SECRET_KEY=your-secret-key-here
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```

6. **Deploy Celery Worker**
   - Add new service from same repo
   - Override start command:
     ```
     celery -A app.workers.celery_app worker --loglevel=info
     ```

---

## Option 2: Docker Compose (Self-Hosted)

### Prerequisites
- VPS with Docker installed (AWS EC2, DigitalOcean, Linode, etc.)
- Domain name (optional but recommended)
- SSH access to server

### 1. Update docker-compose.yml

Add frontend service:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    # ... existing backend config
    
  # ... rest of services
```

### 2. Create Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. Deploy to Server

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone YOUR_REPO_URL
cd YOUR_REPO

# Create .env file
cp .env.example .env
nano .env  # Update with production values

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/synthdata`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/synthdata /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## Option 3: AWS / GCP / Azure

### Frontend: CloudFront + S3
1. Build Next.js app: `npm run build`
2. Export static files or use SSR with Lambda
3. Upload to S3
4. Configure CloudFront

### Backend: ECS / App Engine / App Service
1. Containerize FastAPI app
2. Push to ECR / GCR / ACR
3. Deploy to ECS / Cloud Run / App Service
4. Configure auto-scaling

### Database: RDS / Cloud SQL / Azure Database
1. Provision managed PostgreSQL
2. Configure security groups
3. Update connection string

---

## Environment Variables

### Frontend Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NEXT_PUBLIC_APP_NAME="Synthetic Data Platform"
```

### Backend Production

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
SECRET_KEY=your-production-secret-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ENVIRONMENT=production
```

---

## Performance Optimization

### Frontend

1. **Enable Image Optimization**
   - Use Next.js Image component
   - Configure image domains

2. **Enable Caching**
   - Configure CDN cache headers
   - Use React Query's stale time

3. **Code Splitting**
   - Already handled by Next.js
   - Use dynamic imports for heavy components

### Backend

1. **Database Connection Pooling**
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=20,
       max_overflow=40
   )
   ```

2. **Enable Redis Caching**
   - Cache frequent queries
   - Store generation job results

3. **Background Processing**
   - Use Celery for long-running tasks
   - Scale workers based on queue size

---

## Monitoring & Logging

### Frontend
- Vercel Analytics (built-in)
- Sentry for error tracking
- Google Analytics / Plausible

### Backend
- Prometheus + Grafana
- Sentry for error tracking
- CloudWatch / Datadog logs

### Setup Sentry

```bash
npm install @sentry/nextjs
```

```python
pip install sentry-sdk[fastapi]
```

---

## Backup Strategy

### Database Backups
- Enable automated backups (Railway/RDS)
- Daily snapshots
- Cross-region replication

### Generated Data
- Store in S3 with lifecycle policies
- Archive old generations after 30 days

---

## Security Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set strong SECRET_KEY
- [ ] Enable rate limiting
- [ ] Use environment variables (never commit secrets)
- [ ] Enable database encryption at rest
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Enable API authentication
- [ ] Configure CSP headers

---

## CI/CD Pipeline

### GitHub Actions Example

`.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm ci && npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## Scaling Considerations

### When to Scale

- **Horizontal Scaling:**
  - More concurrent users
  - Higher API request volume
  - Multiple Celery workers

- **Vertical Scaling:**
  - Large dataset generations
  - Memory-intensive operations
  - Database query performance

### Scaling Strategy

1. **Database:** Add read replicas
2. **API:** Add more backend instances
3. **Workers:** Increase Celery worker count
4. **Frontend:** CDN handles this automatically

---

## Cost Optimization

### Estimated Monthly Costs

**Small Scale (< 10K users/month):**
- Vercel: Free
- Railway: $5-20
- Total: ~$20/month

**Medium Scale (< 100K users/month):**
- Vercel: $20
- Railway/Render: $50-100
- Total: ~$120/month

**Large Scale (> 100K users/month):**
- Custom infrastructure
- AWS/GCP: $200-500+
- Total: ~$500+/month

### Tips to Reduce Costs

- Use free tiers where possible
- Enable auto-scaling (scale down during low traffic)
- Archive old data
- Optimize database queries
- Use caching extensively

---

## Troubleshooting

### Frontend Issues

**Build Fails:**
- Check Node.js version (18+)
- Clear `.next` directory
- Verify all dependencies installed

**API Connection:**
- Verify CORS settings
- Check `NEXT_PUBLIC_API_URL`
- Inspect network tab in browser

### Backend Issues

**Database Connection:**
- Verify `DATABASE_URL`
- Check firewall rules
- Test connection manually

**Celery Workers:**
- Ensure Redis is running
- Check worker logs
- Verify task queue configuration

---

## Support & Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## Post-Deployment Checklist

- [ ] Test all pages and features
- [ ] Verify API endpoints working
- [ ] Check database connections
- [ ] Test generation flow end-to-end
- [ ] Verify file downloads working
- [ ] Test on mobile devices
- [ ] Set up monitoring alerts
- [ ] Configure backups
- [ ] Update documentation
- [ ] Train users/team

---

Good luck with your deployment! 🚀
