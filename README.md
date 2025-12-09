# TimeFlow - AI-Powered Time Tracking Dashboard ⏰

A modern, beautiful time tracking web application with AI-powered analytics built with React, TypeScript, Hono, and Cloudflare D1.

![TimeFlow](https://img.shields.io/badge/Built%20with-Mocha-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)

EXPLANATION AND OVERVIEW OF PROJECT
https://drive.google.com/file/d/1eoWvH7_0XYx2TZg8d_In0l8NxeUlfB_b/view?usp=sharing


<img width="1654" height="862" alt="Screenshot 2025-12-10 000903" src="https://github.com/user-attachments/assets/51cdcd88-7c5b-4e0b-a05f-6c05bce31237" />
<img width="1812" height="859" alt="Screenshot 2025-12-10 000956" src="https://github.com/user-attachments/assets/cde156d7-9a8f-4124-8bc2-beffcb1303f5" />
<img width="1806" height="700" alt="Screenshot 2025-12-10 001320" src="https://github.com/user-attachments/assets/9b438e9b-3fd4-492a-b6e4-6939a5c2569a" />
<img width="1680" height="860" alt="Screenshot 2025-12-10 001358" src="https://github.com/user-attachments/assets/6dc5fad5-0fcd-4fe2-8777-9b040c6a482a" />
<img width="1703" height="871" alt="Screenshot 2025-12-10 001421" src="https://github.com/user-attachments/assets/27d37f71-70b5-4ae8-99d8-2693d74fc71e" />
<img width="716" height="858" alt="Screenshot 2025-12-10 001129" src="https://github.com/user-attachments/assets/4ca7d7d9-a977-4091-adbe-f6543c1918b0" />

## 🌟 Features
- **🔐 Google OAuth Authentication** - Secure login with Google accounts
- **📊 Activity Tracking** - Track daily activities across 5 categories (Work, Study, Sleep, Exercise, Entertainment)
- **📈 Beautiful Analytics** - Visualize your time with interactive charts
- **🎨 Premium UI** - Glassmorphism design with smooth animations and emoji accents
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **⚡ Real-time Updates** - Instant feedback and progress tracking
- **🤖 AI Insights** - Smart recommendations and productivity analytics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Beautiful icons
- **date-fns** - Date manipulation

### Backend
- **Hono** - Fast, lightweight web framework for Cloudflare Workers
- **Cloudflare Workers** - Serverless compute platform
- **Cloudflare D1** - SQLite-based serverless database
- **Zod** - Runtime type validation
- **@getmocha/users-service** - Authentication service

## 📁 Project Structure

```
├── src/
│   ├── react-app/           # Frontend React application
│   │   ├── components/      # Reusable UI components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Activity.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── AuthCallback.tsx
│   │   │   └── Landing.tsx
│   │   ├── App.tsx          # Main app component
│   │   └── index.css        # Global styles
│   ├── worker/              # Backend Cloudflare Worker
│   │   └── index.ts         # API endpoints and database logic
│   ├── shared/              # Shared types and schemas
│   │   └── types.ts
│   └── index.html           # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Mocha account (for deployment)
- Google OAuth credentials (automatically handled by Mocha)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/timeflow.git
   cd timeflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   The following secrets are managed by Mocha's platform:
   - `MOCHA_USERS_SERVICE_API_URL` - Authentication service URL
   - `MOCHA_USERS_SERVICE_API_KEY` - Authentication service key

4. **Run database migrations**
   
   Migrations are automatically run when deploying to Mocha.

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🗄️ Database Schema

The app uses Cloudflare D1 (SQLite) with the following schema:

```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  activity_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_user_date ON activities(user_id, activity_date);
CREATE INDEX idx_activities_user_id ON activities(user_id);
```

## 🔌 API Endpoints

### Authentication
- `GET /api/oauth/google/redirect_url` - Get OAuth redirect URL
- `POST /api/sessions` - Exchange code for session token
- `GET /api/users/me` - Get current user info
- `GET /api/logout` - Logout user

### Activities
- `GET /api/activities/:date` - Get activities for a date
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

### Analytics
- `GET /api/analytics/:date` - Get analytics for a date

## 📊 Activity Categories

- 💼 **Work** - Professional and business activities
- 📚 **Study** - Learning and educational activities
- 😴 **Sleep** - Rest and recovery time
- 💪 **Exercise** - Physical activities and workouts
- 🎮 **Entertainment** - Leisure and entertainment

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Gradient Accents** - Beautiful color gradients
- **Floating Emojis** - Animated background elements
- **Smooth Animations** - Fade-ins, slide-ups, and transitions
- **Interactive Cards** - Hover effects and shadows
- **Progress Visualization** - Real-time progress bars
- **Responsive Charts** - Interactive pie and bar charts

## 🚀 Deployment

This app is built for deployment on Mocha's platform:

1. **Create a Mocha account** at [mocha.app](https://mocha.app)

2. **Deploy via Mocha CLI** (or through the web interface)
   ```bash
   mocha deploy
   ```

3. **Database migrations** are automatically applied during deployment

4. **Environment variables** are managed through Mocha's dashboard

The app will be deployed to a Cloudflare Workers environment with D1 database.

## 🔒 Security

- All authentication is handled through Mocha's secure OAuth service
- Session tokens are stored as httpOnly cookies
- Database queries use parameterized statements to prevent SQL injection
- User data is isolated by user ID

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Mocha](https://mocha.app) - The fastest way to build and deploy web apps
- Icons by [Lucide](https://lucide.dev)
- Charts by [Recharts](https://recharts.org)
- Styling with [Tailwind CSS](https://tailwindcss.com)

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ using Mocha
