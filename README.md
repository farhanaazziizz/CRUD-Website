# 📊 ISO Certificate Management System - MVP

> **Demo Version dengan In-App Notification System**

A comprehensive web application for managing ISO 9001 client certificates with automatic notification system that alerts when certificates are expiring within 5 days.

## 🎯 Project Overview

**Purpose**: Demo/prototype for project presentation
**Scope**: Desktop-only, local development, no authentication required
**Target**: Professional corporate environment with clean, modern UI

## 💻 Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React.js + Vite
- **Database**: SQLite3
- **Scheduler**: node-cron
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### Installation & Setup

1. **Clone and navigate to project**
   ```bash
   cd web
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 5173) concurrently.

### Manual Setup (Alternative)

**Backend Setup:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Setup (in new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 📱 Application Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🎨 Features

### ✅ Implemented Features

#### 🏠 Dashboard
- **Statistics Cards**: Total clients, Active certificates, Expiring soon (≤30d), Expired certificates
- **Critical Alerts Table**: Shows certificates expiring within 30 days
- **Quick Actions**: Add client, Export data, Manual notification check

#### 👥 Client Management
- **CRUD Operations**: Create, Read, Update, Delete clients
- **Search & Filter**: By name, location, business type, status
- **Form Validation**: Required fields, date validations, email format
- **Pagination**: 10 items per page
- **Real-time Status**: Auto-calculated days remaining

#### 🔔 Notification System
- **Bell Icon**: Shows unread count with dropdown
- **Auto-refresh**: Every 30 seconds
- **Notification Types**: Warning (≤5 days), Danger (≤2 days), Info
- **Mark as Read**: Individual or bulk actions
- **Notification Page**: Full list with filters

#### ⚡ Automation
- **Scheduled Checks**: Daily at 8:00 AM via node-cron
- **Manual Trigger**: Button for immediate check
- **Status Updates**: Auto-expire certificates past due date
- **Smart Notifications**: Prevent duplicates, progressive alerts

#### 📊 Data Export
- **Excel Export**: All client data with calculated days remaining
- **JSON Format**: Structured data download
- **Timestamp**: Export date tracking

## 🗄️ Database Structure

### Tables

1. **`clients`** - Main client and certificate data
2. **`notifications`** - In-app notifications
3. **`system_logs`** - System activity tracking

### Initial Data

The system automatically seeds with 10 sample clients on first run, including:
- PT. Maju Jaya (Manufacturing)
- CV. Sinar Abadi (Construction)
- PT. Global Prima (Textile)
- And 7 more diverse business types

## 🎯 MVP Testing Scenarios

### 1. Dashboard Overview
- View statistics cards
- Check expiring certificates table
- Notice notification bell (should have unread)

### 2. Notification System
- Click notification bell → see dropdown
- Click "View Details" → navigate to client
- Mark notification as read → bell counter decreases

### 3. Client Management
- Add new client with expiry date 3 days from now
- Edit existing client
- Delete client (with confirmation)
- Search and filter clients

### 4. Manual Operations
- Export data to Excel/JSON
- Run manual notification check
- View all notifications page

## 🔧 API Endpoints

### Clients
- `GET /api/clients` - Get all clients (with pagination, search, filters)
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/stats` - Get dashboard statistics

### Notifications
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/unread` - Get unread notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `POST /api/notifications/trigger-check` - Manual trigger

### Dashboard & Export
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/export/excel` - Export data

## ⚙️ Configuration

### Environment Variables (.env)
```
PORT=5000
DB_PATH=./database.db
NODE_ENV=development
```

### Scheduler Settings
- **Production**: Daily at 8:00 AM
- **Testing**: Can be changed to every minute in `schedulerService.js`

## 🎨 UI Design

### Color Scheme
- **Primary**: `#1e40af` (Professional blue)
- **Success**: `#059669` (Active status)
- **Warning**: `#d97706` (Soon to expire)
- **Danger**: `#dc2626` (Expired/Critical)

### Layout
- **Header**: Logo, Navigation, Clock, Notification Bell
- **Sidebar**: Dashboard, Clients, Notifications
- **Main**: Dynamic content area
- **Responsive**: Desktop-optimized (≥1280px)

## 🚨 Important Notes

1. **No Authentication**: Direct access for demo purposes
2. **Desktop Only**: UI optimized for desktop screens
3. **Local Development**: Runs on localhost only
4. **In-App Notifications**: Website-based, not email
5. **Auto-Seed**: Database populated on first run

## 🛠️ Development

### Project Structure
```
web/
├── backend/          # Node.js API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── services/     # Background services
│   └── utils/        # Helper functions
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── services/    # API calls
│   │   └── utils/       # Helper functions
│   └── public/
└── data/            # Initial data files
```

### Available Scripts
```bash
npm run dev          # Start both backend and frontend
npm run backend      # Start backend only
npm run frontend     # Start frontend only
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production
```

## 📋 Acceptance Criteria ✅

### Functional Requirements
- [x] Dashboard with 4 statistics cards
- [x] CRUD operations for clients
- [x] Form validations
- [x] Notification bell with unread count
- [x] Notification dropdown
- [x] Scheduled daily checks (8 AM)
- [x] Manual trigger for testing
- [x] Excel/JSON export
- [x] Search and filter functionality
- [x] Auto-seeded initial data

### UI/UX Requirements
- [x] Modern corporate design
- [x] Responsive desktop layout
- [x] Color-coded status badges
- [x] Smooth transitions
- [x] Loading states
- [x] Success/error messages
- [x] Confirmation modals

### Technical Requirements
- [x] Clean, readable code
- [x] Error handling
- [x] RESTful API design
- [x] SQLite with foreign keys
- [x] No authentication required
- [x] Easy localhost setup

## 🎉 Demo Ready!

The application is fully functional and ready for demonstration. All MVP requirements have been implemented with a professional, corporate-grade user interface.

---

**Estimated Development Time**: 1-2 days
**Target Audience**: Project demo/presentation
**Priority**: High
**Complexity**: Medium (MVP scope)

🚀 **Ready for presentation!**