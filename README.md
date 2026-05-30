# Raitu Bhoomi

A web platform built to help farmers and agricultural laborers document and preserve their farming journey. Think of it like a detailed logbook for everything that happens on a farm - the work done, labor hired, yields recorded, and experiences shared.

## What's This About?

Raitu Bhoomi (which means "Land of Farmers" in Telugu) is designed around a simple idea: farmers should be able to track their work with dignity and respect. The platform lets farmers record seasonal activities, track yield, manage labor agreements, and share their knowledge. Laborers can also manage their work history and availability.

## Key Features

- **Farmer Dashboard** - Record seasons, track yields, manage labor needs, and share experiences
- **Labor Management** - Track work history, availability, and labor agreements
- **Knowledge Archive** - A shared space where farmers can preserve farming practices and insights
- **Admin Moderation** - Keep the platform clean and trustworthy
- **Secure Authentication** - Role-based access (farmers, laborers, admins)
- **Location-Based** - Everything is organized by village, mandal, and district in Andhra Pradesh

## Tech Stack

**Backend:**
- Node.js + Express for the API
- MongoDB with Mongoose for data storage
- JWT for secure authentication
- bcryptjs for password security
- Multer for file uploads

**Frontend:**
- React 19 with Vite for fast development
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- ESLint for code quality

## Folder Structure

```
raitu-bhoomi/
├── backend/              # Node.js server & API
│   ├── src/
│   │   ├── config/       # Database connection
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, role checking
│   │   └── utils/        # Helper functions
│   └── uploads/          # File storage
│
└── frontend/             # React web app
    ├── src/
    │   ├── components/   # Reusable UI pieces
    │   ├── pages/        # Full page views
    │   ├── services/     # API calls
    │   ├── context/      # State management
    │   └── utils/        # Helper functions
    └── public/           # Static files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy)

## How to Use

1. **Sign up** with your role (farmer or labor)
2. **Farmers** can:
   - Add seasonal records with activities
   - Track yields and harvests
   - Create labor requirements
   - Share experiences in the knowledge archive
3. **Laborers** can:
   - View available work
   - Manage their availability
   - Track work history
4. **Admins** can:
   - Moderate posted content
   - Manage user issues

## API Routes

- `/api/auth` - Login, register, authentication
- `/api/farmer` - Farmer-specific operations (seasons, yields, labor needs)
- `/api/labor` - Labor work history and availability
- `/api/archive` - Knowledge sharing and preservation
- `/api/admin` - Admin moderation functions

## Project Philosophy

This isn't a social media app, and it's not meant to replace traditional farming knowledge. There are no recommendations, predictions, or AI advice here. What we're doing is simply helping farmers document what's actually happening on their farms - the reality of their work, their efforts, and their results. That data becomes valuable over time, and it's something they own.

## Development Notes

- The frontend uses Tailwind CSS for styling - check `tailwind.config.cjs` for customization
- API responses follow a consistent format with `success`, `message`, and `data` fields
- Authentication tokens are stored and sent with each request
- File uploads are handled with multer and stored in the uploads folder

## Common Commands

**Backend:**
- `npm run dev` - Start with auto-reload (development)
- `npm start` - Start without reload (production)

**Frontend:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run preview` - Preview production build locally

## Troubleshooting

**Backend won't connect to MongoDB?**
- Check your MongoDB connection string in `.env`
- Make sure MongoDB is running (if local)
- Verify network access (if using Atlas)

**Frontend not connecting to backend?**
- Make sure backend is running on port 5000
- Check CORS settings in backend/src/app.js
- Look at browser console for specific API errors

**Port already in use?**
- Backend: Change PORT in `.env`
- Frontend: Vite will suggest an alternate port automatically

## Contributing

This is built for real farmers and laborers in mind. When making changes, think about whether it actually helps them manage their work better or preserves their knowledge more effectively.

---

Built with care for the farming community.
