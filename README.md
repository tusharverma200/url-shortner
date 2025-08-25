# URL Shortener

A full-stack URL shortener application built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- Submit long URLs and get shortened versions
- Copy shortened URLs to clipboard
- Automatic redirection when visiting short URLs
- URL validation and error handling

### Admin Features
- Secure admin login system
- Dashboard with analytics:
  - Total URLs created
  - Total clicks across all URLs
  - Average clicks per URL
- Complete list of all shortened URLs with click counts
- Real-time statistics

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Password Hashing**: bcryptjs
- **URL Generation**: nanoid

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your-secret-key-here
PORT=3001
```

3. Start the application:
```bash
npm run dev
```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Public Routes
- `POST /api/shorten` - Create a shortened URL
- `GET /:shortcode` - Redirect to original URL

### Admin Routes
- `POST /api/admin/login` - Admin login
- `GET /api/admin/urls` - Get all URLs with statistics (requires authentication)

## Usage

1. **Shorten a URL**: Enter a long URL in the main form and click "Shorten URL"
2. **Use shortened URL**: Visit the generated short URL to be redirected to the original
3. **Admin Dashboard**: Navigate to the Admin section, login, and view analytics

## Project Structure

```
├── server/
│   ├── models/
│   │   ├── Url.js          # URL schema
│   │   └── Admin.js        # Admin user schema
│   └── index.js            # Express server
├── src/
│   ├── components/
│   │   ├── UrlShortener.tsx    # Main URL shortening form
│   │   ├── AdminLogin.tsx      # Admin login form
│   │   └── AdminDashboard.tsx  # Admin analytics dashboard
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context
│   └── App.tsx             # Main application component
└── package.json
```