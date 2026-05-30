"# Raitu Bhoomi - Backend API Documentation

This document describes all the API endpoints that the Node.js/Express backend needs to implement for the Raitu Bhoomi frontend to function correctly.

## Base URL
All API endpoints should be prefixed with `/api`

Example: `http://localhost:8000/api/auth/register`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### POST /api/auth/register
Register a new user (farmer, labor, or admin)

**Request Body:**
```json
{
  \"fullName\": \"John Doe\",
  \"phone\": \"9876543210\",
  \"village\": \"Ramapuram\",
  \"mandal\": \"Tanuku\",
  \"district\": \"West Godavari\",
  \"state\": \"Andhra Pradesh\",
  \"role\": \"farmer\",
  \"password\": \"password123\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"message\": \"User registered successfully\"
}
```

### POST /api/auth/login
User login

**Request Body:**
```json
{
  \"phone\": \"9876543210\",
  \"password\": \"password123\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"token\": \"jwt_token_here\",
  \"user\": {
    \"_id\": \"user_id\",
    \"fullName\": \"John Doe\",
    \"phone\": \"9876543210\",
    \"village\": \"Ramapuram\",
    \"mandal\": \"Tanuku\",
    \"district\": \"West Godavari\",
    \"state\": \"Andhra Pradesh\",
    \"role\": \"farmer\",
    \"willingTravel\": null
  }
}
```

---

## 2. Farmer Endpoints

### POST /api/farmer/seasons
Create a new farming season record

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"year\": 2025,
  \"crop\": \"Paddy\",
  \"fieldArea\": \"2 acres 50 cents\",
  \"preparationDate\": \"2025-01-15\",
  \"ploughingDates\": [\"2025-01-20\"],
  \"sowingDate\": \"2025-02-01\",
  \"transplantingDate\": \"2025-02-15\",
  \"weedingDates\": [\"2025-03-10\"],
  \"harvestDate\": null,
  \"pesticideUses\": [
    {
      \"type\": \"Organic pesticide\",
      \"date\": \"2025-03-15\",
      \"cost\": 1500
    }
  ],
  \"machineryUses\": [
    {
      \"machine\": \"Tractor\",
      \"date\": \"2025-01-20\",
      \"duration\": \"4 hours\",
      \"cost\": 2000
    }
  ],
  \"totalLaborCost\": 15000,
  \"totalMachineryCost\": 8000,
  \"totalInvestment\": 30000
}
```

**Response:**
```json
{
  \"success\": true,
  \"season\": { /* season object */ }
}
```

### GET /api/farmer/seasons
Get all seasons for the logged-in farmer

**Headers:** Authorization: Bearer <token>

**Response:**
```json
[
  {
    \"_id\": \"season_id\",
    \"farmer\": \"farmer_id\",
    \"year\": 2025,
    \"crop\": \"Paddy\",
    \"fieldArea\": \"2 acres 50 cents\",
    \"preparationDate\": \"2025-01-15\",
    \"ploughingDates\": [\"2025-01-20\"],
    \"sowingDate\": \"2025-02-01\",
    \"transplantingDate\": \"2025-02-15\",
    \"weedingDates\": [\"2025-03-10\"],
    \"harvestDate\": null,
    \"pesticideUses\": [...],
    \"machineryUses\": [...],
    \"totalLaborCost\": 15000,
    \"totalMachineryCost\": 8000,
    \"totalInvestment\": 30000,
    \"createdAt\": \"2025-01-15T10:00:00.000Z\",
    \"updatedAt\": \"2025-01-15T10:00:00.000Z\"
  }
]
```

### GET /api/farmer/seasons/:seasonId
Get a specific season by ID

**Headers:** Authorization: Bearer <token>

**Response:** Season object

### PUT /api/farmer/seasons/:seasonId
Update a season record

**Headers:** Authorization: Bearer <token>

**Request Body:** Same as create season

**Response:** Updated season object

### POST /api/farmer/yield
Create yield record for a completed season

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"season\": \"season_id\",
  \"year\": 2025,
  \"totalBags\": 85,
  \"weightPerBag\": 83,
  \"pricePerBag\": 2200,
  \"totalAmount\": 187000,
  \"harvestCompletionDate\": \"2025-06-15\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"yieldRecord\": { /* yield record object */ }
}
```

### GET /api/farmer/yield
Get all yield records for the logged-in farmer

**Headers:** Authorization: Bearer <token>

**Response:** Array of yield records with populated season data

### POST /api/farmer/labor-requirements
Create a labor requirement posting

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"village\": \"Ramapuram\",
  \"mandal\": \"Tanuku\",
  \"workType\": \"Transplanting\",
  \"requiredDate\": \"2025-02-15\",
  \"numberOfPeople\": 5,
  \"notes\": \"Need experienced workers\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"requirement\": { /* requirement object */ }
}
```

### GET /api/farmer/labor-requirements
Get all labor requirements posted by the farmer

**Headers:** Authorization: Bearer <token>

**Response:** Array of labor requirements

### DELETE /api/farmer/labor-requirements/:requirementId
Delete a labor requirement

**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  \"success\": true,
  \"message\": \"Requirement deleted\"
}
```

### POST /api/farmer/land-sharing
Create a land sharing agreement

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"cultivator\": \"user_id\",
  \"crop\": \"Paddy\",
  \"area\": \"1 acre\",
  \"year\": 2025,
  \"expectedBags\": 40,
  \"expectedPricePerBag\": 2200,
  \"givenBags\": null,
  \"givenAmount\": null
}
```

**Response:**
```json
{
  \"success\": true,
  \"sharing\": { /* land sharing object */ }
}
```

### GET /api/farmer/land-sharing
Get all land sharing agreements (as owner or cultivator)

**Headers:** Authorization: Bearer <token>

**Response:** Array of land sharing agreements with populated user data

### PUT /api/farmer/land-sharing/:sharingId/approve
Approve a land sharing agreement (both parties must approve)

**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  \"success\": true,
  \"sharing\": { /* updated sharing object */ }
}
```

---

## 3. Labor Endpoints

### PUT /api/labor/availability
Update labor's willing travel range

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"willingTravel\": \"nearby_villages\"
}
```

**Allowed values:** \"same_village\", \"nearby_villages\", \"mandal_level\"

**Response:**
```json
{
  \"success\": true,
  \"user\": { /* updated user object */ }
}
```

### GET /api/labor/requirements
Get available labor requirements based on travel preference

**Headers:** Authorization: Bearer <token>

**Query Parameters:** None (filters automatically based on user's location and willingTravel setting)

**Response:** Array of labor requirements

### POST /api/labor/requirements/:requirementId/accept
Accept a labor requirement (optional - for tracking)

**Headers:** Authorization: Bearer <token>

**Response:**
```json
{
  \"success\": true,
  \"message\": \"Requirement accepted\"
}
```

### GET /api/labor/work-history
Get labor's work history

**Headers:** Authorization: Bearer <token>

**Response:**
```json
[
  {
    \"_id\": \"work_id\",
    \"labor\": \"labor_id\",
    \"farmer\": {
      \"_id\": \"farmer_id\",
      \"fullName\": \"Farmer Name\"
    },
    \"village\": \"Ramapuram\",
    \"mandal\": \"Tanuku\",
    \"workType\": \"Transplanting\",
    \"workDate\": \"2025-02-15\",
    \"duration\": \"full_day\",
    \"createdAt\": \"2025-02-15T10:00:00.000Z\"
  }
]
```

### POST /api/labor/work
Create a work record (can be created by labor or farmer)

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"farmer\": \"farmer_id\",
  \"village\": \"Ramapuram\",
  \"mandal\": \"Tanuku\",
  \"workType\": \"Transplanting\",
  \"workDate\": \"2025-02-15\",
  \"duration\": \"full_day\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"workRecord\": { /* work record object */ }
}
```

---

## 4. Archive Endpoints (Knowledge Archive)

### GET /api/archive/posts
Get all approved archive posts (public endpoint)

**Query Parameters:**
- crop (optional): Filter by crop type
- village (optional): Filter by village

**Response:**
```json
[
  {
    \"_id\": \"post_id\",
    \"farmer\": {
      \"_id\": \"farmer_id\",
      \"fullName\": \"Farmer Name\",
      \"village\": \"Ramapuram\",
      \"mandal\": \"Tanuku\"
    },
    \"content\": \"This season paddy was transplanted after second rain...\",
    \"images\": [\"url1\", \"url2\"],
    \"status\": \"approved\",
    \"createdAt\": \"2025-01-20T10:00:00.000Z\",
    \"approvedAt\": \"2025-01-21T10:00:00.000Z\"
  }
]
```

### POST /api/archive/posts
Create a new archive post (farmer only)

**Headers:** Authorization: Bearer <token>

**Request Body:**
```json
{
  \"content\": \"This season paddy was transplanted after second rain. Field preparation took 2 weeks...\",
  \"images\": [\"url1\", \"url2\"]
}
```

**Response:**
```json
{
  \"success\": true,
  \"post\": { /* post object with status: pending */ }
}
```

### POST /api/archive/upload
Upload image for archive post

**Headers:** 
- Authorization: Bearer <token>
- Content-Type: multipart/form-data

**Request Body:** FormData with image file

**Response:**
```json
{
  \"success\": true,
  \"imageUrl\": \"https://storage.example.com/image.jpg\"
}
```

---

## 5. Admin Endpoints

### GET /api/admin/posts/pending
Get all pending posts for moderation

**Headers:** Authorization: Bearer <token> (admin only)

**Response:** Array of pending posts with farmer data

### PUT /api/admin/posts/:postId/approve
Approve a post

**Headers:** Authorization: Bearer <token> (admin only)

**Response:**
```json
{
  \"success\": true,
  \"post\": { /* approved post object */ }
}
```

### PUT /api/admin/posts/:postId/reject
Reject a post

**Headers:** Authorization: Bearer <token> (admin only)

**Request Body:**
```json
{
  \"reason\": \"Contains advice/recommendations\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"post\": { /* rejected post object */ }
}
```

### GET /api/admin/posts
Get all posts (approved, pending, rejected)

**Headers:** Authorization: Bearer <token> (admin only)

**Response:** Array of all posts

---

## Database Models (Mongoose Schemas)

### User Schema
```javascript
{
  fullName: String (required),
  phone: String (required, unique),
  village: String (required),
  mandal: String (required),
  district: String (required),
  state: String (default: 'Andhra Pradesh'),
  role: String (enum: ['farmer', 'labor', 'admin'], required),
  willingTravel: String (enum: ['same_village', 'nearby_villages', 'mandal_level']),
  password: String (required, hashed),
  createdAt: Date
}
```

### FarmerSeason Schema
```javascript
{
  farmer: ObjectId (ref: 'User', required),
  year: Number (required),
  crop: String (required, default: 'Paddy'),
  fieldArea: String,
  preparationDate: Date,
  ploughingDates: [Date],
  sowingDate: Date,
  transplantingDate: Date,
  weedingDates: [Date],
  pesticideUses: [{
    date: Date,
    type: String,
    cost: Number
  }],
  machineryUses: [{
    date: Date,
    machine: String,
    duration: String,
    cost: Number
  }],
  harvestDate: Date,
  totalLaborCost: Number (default: 0),
  totalMachineryCost: Number (default: 0),
  totalInvestment: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### YieldRecord Schema
```javascript
{
  farmer: ObjectId (ref: 'User', required),
  season: ObjectId (ref: 'FarmerSeason', required),
  year: Number (required),
  totalBags: Number (required),
  weightPerBag: Number (default: 83),
  pricePerBag: Number (required),
  totalAmount: Number (required),
  harvestCompletionDate: Date (required),
  createdAt: Date
}
```

### ArchivePost Schema
```javascript
{
  farmer: ObjectId (ref: 'User', required),
  content: String (required),
  images: [String],
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  createdAt: Date,
  approvedAt: Date,
  rejectedReason: String
}
```

### LaborRequirement Schema
```javascript
{
  farmer: ObjectId (ref: 'User', required),
  village: String (required),
  mandal: String (required),
  workType: String (required),
  requiredDate: Date (required),
  numberOfPeople: Number (required),
  notes: String,
  active: Boolean (default: true),
  createdAt: Date
}
```

### LaborWork Schema
```javascript
{
  labor: ObjectId (ref: 'User', required),
  farmer: ObjectId (ref: 'User', required),
  village: String (required),
  mandal: String (required),
  workType: String (required),
  workDate: Date (required),
  duration: String (enum: ['half_day', 'full_day'], required),
  createdAt: Date
}
```

### LandSharing Schema
```javascript
{
  owner: ObjectId (ref: 'User', required),
  cultivator: ObjectId (ref: 'User', required),
  crop: String (required),
  area: String (required),
  year: Number (required),
  expectedBags: Number,
  expectedPricePerBag: Number,
  givenBags: Number,
  givenAmount: Number,
  agreedByBoth: Boolean (default: false),
  createdAt: Date
}
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  \"success\": false,
  \"message\": \"Validation error message\"
}
```

**401 Unauthorized:**
```json
{
  \"success\": false,
  \"message\": \"Unauthorized - Invalid or missing token\"
}
```

**403 Forbidden:**
```json
{
  \"success\": false,
  \"message\": \"Access denied - insufficient permissions\"
}
```

**404 Not Found:**
```json
{
  \"success\": false,
  \"message\": \"Resource not found\"
}
```

**500 Internal Server Error:**
```json
{
  \"success\": false,
  \"message\": \"Internal server error\"
}
```

---

## Notes for Backend Implementation

1. **Password Security:** Use bcrypt to hash passwords before storing
2. **JWT:** Use jsonwebtoken library for authentication
3. **Middleware:** Create auth middleware to verify JWT tokens
4. **Role-based Access:** Implement role-checking middleware
5. **Validation:** Use express-validator or Joi for request validation
6. **CORS:** Enable CORS for frontend communication
7. **MongoDB Indexes:** Add indexes on frequently queried fields (phone, farmer, status, etc.)
8. **Populate:** Use Mongoose populate() for referenced data (farmer in posts, season in yields, etc.)
9. **Date Handling:** Store dates in ISO format
10. **File Upload:** Use multer or similar for image uploads (optional)

---

## Environment Variables (.env)

```
PORT=8000
MONGO_URI=mongodb://localhost:27017/raitu_bhoomi
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
```

---

This completes the API documentation. The frontend is already built and ready to consume these endpoints.
"