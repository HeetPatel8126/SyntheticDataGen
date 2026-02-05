# Synthetic Data Generation Platform - Frontend

A premium, developer-focused web application for generating and managing synthetic datasets, inspired by Vercel, Supabase, and Linear.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **State Management**: Zustand
- **API Client**: Axios with React Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.local.example .env.local
```

3. Update the `.env.local` file with your backend API URL.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── (marketing)/          # Landing page
├── (dashboard)/          # Dashboard layout with sidebar
│   ├── dashboard/        # Overview page
│   ├── generate/         # Data generator
│   ├── history/          # Generation history
│   ├── templates/        # Templates
│   └── settings/         # Settings
├── api/                  # API routes (if needed)
components/
├── ui/                   # shadcn components
├── layout/               # Layout components
└── ...                   # Feature components
lib/
├── api.ts                # API client
├── store.ts              # Zustand store
└── utils.ts              # Utilities
```

## Features

- 🎨 Premium dark-first design
- ⚡ Real-time data generation preview
- 📊 Interactive data visualization
- 🎭 Smooth animations and micro-interactions
- 📱 Fully responsive design
- ♿ Accessible UI components
- 🔄 Optimistic UI updates
- 🎯 Type-safe with TypeScript

## Design System

### Colors
- Background: Deep blacks (#0A0A0A, #111111)
- Accent: Purple (#8B5CF6) and Indigo (#6366F1)
- Status: Green, Amber, Red
- Text: Grays from #FAFAFA to #737373

### Typography
- Headings: Space Grotesk
- Body: Inter
- Code: JetBrains Mono

## License

MIT
