# Synthetic Data Generation Platform - Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the complete Synthetic Data Generation Platform, including both backend and frontend.

## Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **npm** or **yarn**
- **Git**

## Backend Setup

The backend is a FastAPI application that handles data generation.

### 1. Install Python Dependencies

```bash
# From the project root directory
pip install -r requirements.txt
```

### 2. Set Up Database

```bash
# Initialize Alembic migrations
alembic upgrade head
```

### 3. Start the Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Setup

The frontend is a Next.js 14 application with a premium dark theme.

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_APP_NAME="Synthetic Data Platform"
NEXT_PUBLIC_MAX_RECORDS=1000000
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🎨 Frontend Features

### Pages Included:

1. **Landing Page** (`/`)
   - Hero section with animated gradients
   - Features showcase
   - Call-to-action sections
   - Responsive footer

2. **Dashboard** (`/dashboard`)
   - Stats overview (generations, records, storage)
   - Quick actions
   - Recent generations list

3. **Data Generator** (`/dashboard/generate`)
   - Data type selection (Users, E-commerce, Companies)
   - Record count slider (100 to 1M)
   - Output format selection (JSON, CSV, SQL, Parquet)
   - Live preview (table & JSON views)
   - Advanced options (locale selection)

4. **Generation History** (`/dashboard/history`)
   - List of all generation jobs
   - Status indicators with colors
   - Search and filter functionality
   - Download and delete actions
   - Progress tracking for in-progress jobs

5. **Templates** (`/dashboard/templates`)
   - Browse pre-built templates
   - Create custom templates
   - Monaco editor for schema editing
   - Template management

6. **Settings** (`/dashboard/settings`)
   - Profile management
   - API key management
   - Notifications
   - Security settings

## 🎨 Design System

### Color Palette:
- Background Primary: `#0A0A0A`
- Background Secondary: `#111111`
- Border: `#262626`
- Accent Purple: `#8B5CF6`
- Accent Indigo: `#6366F1`
- Text Primary: `#FAFAFA`
- Text Secondary: `#A3A3A3`

### Typography:
- Headings: Space Grotesk
- Body: Inter
- Code: JetBrains Mono

### Key Features:
- Dark-first premium design
- Glassmorphism effects
- Smooth animations with Framer Motion
- Grid and dot patterns
- Gradient accents
- Micro-interactions

## 🛠️ Tech Stack

### Frontend:
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Code Editor:** Monaco Editor
- **Charts:** Recharts
- **State:** Zustand
- **API Client:** Axios + React Query

### Backend:
- **Framework:** FastAPI
- **Database:** PostgreSQL (via SQLAlchemy)
- **Task Queue:** Celery
- **Data Generation:** Faker

## 📁 Project Structure

```
frontend/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx              # Landing page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── generate/
│   │   │   └── page.tsx          # Data generator
│   │   ├── history/
│   │   │   └── page.tsx          # Generation history
│   │   ├── templates/
│   │   │   ├── page.tsx          # Templates list
│   │   │   └── new/
│   │   │       └── page.tsx      # Create template
│   │   └── settings/
│   │       └── page.tsx          # Settings
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── providers.tsx             # React Query provider
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api.ts                    # API client
│   ├── store.ts                  # Zustand store
│   ├── utils.ts                  # Utility functions
│   └── constants.ts              # Constants
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Production Build

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
# Using Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🐳 Docker Deployment

You can use the existing `docker-compose.yml` to run the entire stack:

```bash
docker-compose up -d
```

This will start:
- Backend API
- PostgreSQL database
- Redis
- Celery workers

Then run the frontend separately or add it to docker-compose.

## 🔧 Development Tips

### Frontend Hot Reload
Next.js automatically reloads when you save files.

### API Integration
The frontend is configured to call the backend at `http://localhost:8000`. Make sure both servers are running.

### State Management
- Use the Zustand store (`useGeneratorStore`) for generator settings
- Use React Query for API calls and caching

### Adding New Components
```bash
# shadcn/ui components can be added via:
npx shadcn-ui@latest add [component-name]
```

## 📝 Environment Variables

### Frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_APP_NAME="Synthetic Data Platform"
NEXT_PUBLIC_MAX_RECORDS=1000000
```

### Backend `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_SUPABASE_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
```

## 🎯 Next Steps

1. **Customize the Design:** Update colors in `tailwind.config.ts` and `globals.css`
2. **Add Authentication:** Integrate with your auth provider
3. **Connect Backend:** Ensure backend API endpoints match the frontend API client
4. **Add Analytics:** Integrate analytics for tracking usage
5. **Deploy:** Deploy to Vercel (frontend) and your preferred backend host

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/)
- [React Query](https://tanstack.com/query/latest)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### API Connection Issues
- Verify backend is running on port 8000
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## 🎉 Success!

You should now have a fully functional Synthetic Data Generation Platform running locally!

Visit:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

Enjoy generating synthetic data! 🚀
