# CS-Linker - URL Shortener with Vue Frontend

A modern URL shortener application with a Vue.js frontend and Express.js backend.

## Architecture

- **Backend (Express.js)**: RESTful API running on port 13001
- **Frontend (Vue.js + Vite)**: Single-page application running on port 13002
- **Database**: SQLite/PostgreSQL (configurable)

## Quick Start

### 1. Install Dependencies

```bash
# Install backend dependencies (from root directory)
npm install

# Install frontend dependencies
cd client-vite
npm install
cd ..
```

### 2. Setup Database

```bash
# Run database migrations
npm run migrate
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend server (port 13001)
npm run dev

# Terminal 2: Start frontend server (port 13002)
npm run dev:client
```

### 4. Access the Application

- **Frontend**: http://localhost:13002
- **Backend API**: http://localhost:13001

## API Endpoints

### Create Short Link
- **POST** `/cli` - Create a new short link
- **Body**: `{ "address": "https://example.com" }`
- **Response**: `{ "direct_link": "...", "page_link": "...", "code": "..." }`

### Get Link Info
- **GET** `/k/:code` - Get link information
- **Response**: `{ "originalUrl": "...", "pageLink": "...", "directLink": "...", "code": "..." }`

### Direct Redirect
- **GET** `/g/:code` - Redirect directly to the original URL

### List All Links (Admin)
- **GET** `/links/:secret` - Get all links (requires secret)

## Frontend Features

- **Create Links**: Simple form to create shortened URLs
- **Link Management**: View and copy generated links
- **Clipboard Integration**: One-click copy to clipboard
- **Responsive Design**: Works on desktop and mobile

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
SECRET=your-secret-key
URL_BASE=http://localhost:13001
```

### Frontend Configuration

The frontend uses Vite's proxy feature to communicate with the backend. Configuration is in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 13002,
    proxy: {
      '/api': {
        target: 'http://localhost:13001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

## Development

### Backend Development
- Uses `nodemon` for auto-restart on file changes
- Runs on port 13001
- API returns JSON responses

### Frontend Development
- Uses Vite for fast development and hot module replacement
- Runs on port 13002
- Proxies API calls to backend

## Tech Stack

- **Backend**: Express.js, Knex.js, SQLite/PostgreSQL
- **Frontend**: Vue 3, Vue Router, Vite
- **Security**: Helmet, Express Rate Limit
- **Testing**: Mocha, Playwright
