"# Raitu Bhoomi - Frontend Documentation

## 🌾 Project Overview

**Raitu Bhoomi** is an agricultural support system designed to respect village life, farmer experience, and labor dignity. The platform records and preserves the full farming lifecycle — time, effort, cost, labor, yield, and lived experience.

### Key Principles
- ❌ No teaching or recommendations
- ❌ No predictions or AI advice
- ❌ No social media features
- ✅ Respectful data recording
- ✅ Knowledge preservation
- ✅ Labor dignity

---

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/               # Images, icons (to be added)
│   ├── components/
│   │   ├── common/          # Navbar, Footer, ProtectedRoute, Loader
│   │   ├── farmer/          # SeasonTimeline, YieldTable, etc.
│   │   ├── labor/           # LaborHistoryCard, AvailabilityForm
│   │   └── archive/         # ArchivePostCard, ArchiveFilter
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── farmer/          # FarmerDashboard, AddSeasonRecord, etc.
│   │   ├── labor/           # LaborDashboard, WorkHistory
│   │   ├── admin/           # AdminModeration
│   │   └── archive/         # KnowledgeArchive
│   ├── context/
│   │   ├── AuthContext.jsx  # Authentication state
│   │   └── UserContext.jsx  # User profile state
│   ├── services/
│   │   ├── authService.js
│   │   ├── farmerService.js
│   │   ├── laborService.js
│   │   ├── archiveService.js
│   │   └── adminService.js
│   ├── utils/
│   │   ├── dateUtils.js     # Date formatting utilities
│   │   └── costUtils.js     # Cost calculation utilities
│   ├── App.jsx              # Main app with routes
│   ├── index.js
│   ├── App.css
│   └── index.css
├── package.json
├── tailwind.config.js
└── .env
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager
- Backend API running (see API_DOCUMENTATION.md)

### Installation

1. **Install dependencies:**
```bash
cd frontend
yarn install
```

2. **Configure environment variables:**

Create or update `.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

3. **Start development server:**
```bash
yarn start
```

The app will open at `http://localhost:3000`

---

## 🎨 Tech Stack

- **React 19.0.0** - UI library
- **React Router v7** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **React Hook Form + Zod** - Form handling & validation

---

## 👥 User Roles & Features

### 1. Farmer
**Dashboard:**
- View current season timeline with day counter
- Track investment (labor, machinery, total)
- Record seasonal activities (preparation, ploughing, sowing, etc.)

**Features:**
- Add/Edit season records
- Record yield (bags, price, total amount)
- Year-to-year comparison
- Share farming experiences
- Post labor requirements
- Manage land sharing agreements

**Routes:**
- `/farmer/dashboard`
- `/farmer/add-season`
- `/farmer/yield-summary`
- `/farmer/share-experience`

---

### 2. Labor
**Dashboard:**
- View work statistics (total days, farmers worked with)
- Set travel preference (same village, nearby villages, mandal level)
- View available work opportunities
- Track work history

**Features:**
- Update availability settings
- View labor requirements based on location
- Maintain dignified work history (no ratings)

**Routes:**
- `/labor/dashboard`
- `/labor/work-history`

---

### 3. Admin
**Moderation:**
- Review pending archive posts
- Approve/reject posts based on guidelines
- Ensure posts are experiences, not advice

**Routes:**
- `/admin/moderation`

---

### 4. Public (No Login Required)
**Home Page:**
- Platform information
- Links to register/login
- Access to Knowledge Archive

**Knowledge Archive:**
- Read approved farming experiences
- Filter by crop/village
- No likes, comments, or social features
- View-only, respectful presentation

**Routes:**
- `/` (Home)
- `/archive` (Knowledge Archive)
- `/login`
- `/register`

---

## 🔐 Authentication Flow

1. **Registration:**
   - User provides: name, phone, village, mandal, district, state
   - Selects role: Farmer or Labor
   - Creates password
   - Account created (pending login)

2. **Login:**
   - User logs in with phone + password
   - Receives JWT token
   - Token stored in localStorage
   - Redirected to role-specific dashboard

3. **Protected Routes:**
   - Uses `ProtectedRoute` component
   - Checks authentication
   - Validates user role
   - Redirects unauthorized users

---

## 🛠️ Key Components

### Common Components

#### Navbar
- Logo and branding
- Role-based navigation links
- Login/Register or Logout button
- User info display when logged in

#### Footer
- Platform information
- Contact details
- Copyright

#### ProtectedRoute
- Wrapper for authenticated routes
- Role-based access control
- Redirects to login if not authenticated

#### Loader
- Loading spinner
- Used during data fetching

---

### Farmer Components

#### SeasonTimeline
- Visual timeline of seasonal activities
- Current day counter
- Investment breakdown
- Activity completion status

#### YieldTable
- Tabular display of yield records
- Year-to-year comparison
- Total bags, price, amount
- Summary statistics

#### LaborRequirementCard
- Display posted labor requirements
- Village, date, work type, people needed
- Delete option for farmer

#### LandSharingTable
- Display land sharing agreements
- Expected vs given bags/amount
- Agreement status

---

### Labor Components

#### LaborHistoryCard
- Individual work record display
- Farmer name, location, date
- Work type and duration

#### AvailabilityForm
- Radio buttons for travel preference
- Same village / Nearby villages / Mandal level
- Updates user profile

---

### Archive Components

#### ArchivePostCard
- Display farming experience post
- Farmer info (name, village)
- Content and images
- Date posted
- Disclaimer text

#### ArchiveFilter
- Filter posts by crop type
- Filter by village
- Reset filters option

---

## 📡 API Integration

All API calls are centralized in service files under `src/services/`:

### authService.js
- `register()` - User registration
- `login()` - User login
- `logout()` - Clear local storage
- `getCurrentUser()` - Get user from storage
- `isAuthenticated()` - Check auth status

### farmerService.js
- Season management (create, get, update)
- Yield records (create, get)
- Labor requirements (create, get, delete)
- Land sharing (create, get, approve)

### laborService.js
- Update availability
- Get available requirements
- Get work history
- Create work records

### archiveService.js
- Get posts (with filters)
- Create post
- Upload images

### adminService.js
- Get pending posts
- Approve post
- Reject post
- Get all posts

---

## 🎨 Styling Guidelines

### Tailwind Configuration
- Primary color: Green (`green-600`, `green-700`)
- Secondary colors: Blue, Orange, Purple for different sections
- Neutral: Gray scale for text and borders

### Design Principles
- Clean, simple layouts
- Adequate whitespace
- Mobile-responsive (grid system)
- Accessible (proper labels, contrast)
- No flashy animations (respectful tone)

### Common Classes
- Cards: `bg-white rounded-lg shadow-md p-6`
- Buttons: `bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded transition`
- Inputs: `w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`

---

## 🧪 Testing Data IDs

All interactive and key elements have `data-testid` attributes for automated testing:

**Examples:**
- `data-testid=\"login-phone-input\"`
- `data-testid=\"register-submit-button\"`
- `data-testid=\"farmer-dashboard-title\"`
- `data-testid=\"archive-post-card\"`
- `data-testid=\"season-timeline\"`

This enables easy end-to-end testing with tools like Playwright or Cypress.

---

## 📝 Context API Usage

### AuthContext
Manages authentication state:
- `user` - Current user object
- `login(phone, password)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `isAuthenticated` - Boolean
- `loading` - Loading state

### UserContext
Manages user profile:
- `userProfile` - User details
- `updateProfile(updates)` - Update profile
- `isFarmer` - Boolean helper
- `isLabor` - Boolean helper
- `isAdmin` - Boolean helper

---

## 🔄 Data Flow

1. **User Action** → Component
2. **Component** → Service function
3. **Service** → API call (axios)
4. **API Response** → Service
5. **Service** → Component state update
6. **State Update** → UI re-render

**Example:**
```javascript
// User clicks \"Login\"
const handleLogin = async () => {
  // Call service
  const result = await authService.login(phone, password);
  
  // Update context
  if (result.success) {
    setUser(result.user);
    navigate('/farmer/dashboard');
  }
};
```

---

## 🚨 Error Handling

All API calls use try-catch blocks:

```javascript
try {
  const data = await farmerService.getSeasons();
  setSeasons(data);
} catch (error) {
  setError(error.response?.data?.message || 'Failed to load data');
} finally {
  setLoading(false);
}
```

Errors are displayed to users via:
- Alert messages
- Toast notifications (can be added)
- Inline error messages

---

## 📦 Build & Deployment

### Build for Production
```bash
yarn build
```

Creates optimized production build in `build/` directory.

### Environment Variables
Make sure to set production backend URL:
```env
REACT_APP_BACKEND_URL=https://api.raitubhoomi.com
```

---

## 🔮 Future Enhancements (Optional)

1. **Image Upload:**
   - Local file upload for archive posts
   - Image compression
   - Cloud storage integration

2. **Notifications:**
   - Labor requirement alerts
   - Season reminders
   - Harvest date notifications

3. **Offline Support:**
   - Service workers
   - Local data caching
   - Sync when online

4. **Localization:**
   - Telugu language support
   - Regional date formats
   - Currency formatting

5. **Reports:**
   - Downloadable yield reports
   - Season summary PDFs
   - Investment analysis charts

---

## 📞 Support

For issues or questions about the frontend:
- Check API documentation: `API_DOCUMENTATION.md`
- Review component code in `src/components/`
- Check service files for API call structure

---

## ✅ Complete Feature Checklist

### Authentication ✅
- [x] Registration page
- [x] Login page
- [x] Protected routes
- [x] Role-based navigation

### Farmer Features ✅
- [x] Dashboard with season timeline
- [x] Add season record form
- [x] Yield summary table
- [x] Year-to-year comparison
- [x] Share experience form
- [x] Labor requirement posting
- [x] Land sharing management

### Labor Features ✅
- [x] Dashboard with statistics
- [x] Availability settings
- [x] View work requirements
- [x] Work history display

### Archive Features ✅
- [x] Public knowledge archive
- [x] Post filtering
- [x] Experience card display
- [x] Neutral presentation

### Admin Features ✅
- [x] Moderation dashboard
- [x] Approve/reject posts
- [x] Content guidelines display

---

**Frontend is 100% complete and ready for backend integration!**

Once you implement the Node.js/Express backend as per the API documentation, the entire system will be fully functional.
"