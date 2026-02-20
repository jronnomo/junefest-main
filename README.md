# JUNEFEST

The unified JUNEFEST web application — public site, e-commerce shop, and admin CMS — all in one MERN stack app.

## Stack

- **Frontend**: React 18, Redux Toolkit (RTK Query), React Bootstrap, React Router v6
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Netlify (frontend) + Render (backend)

## Development Setup

### 1. Install dependencies

```bash
npm install
npm install --prefix frontend
```

### 2. Configure environment

Copy `example.env` to `.env` and fill in your values:

```
NODE_ENV = development
PORT = 8000
MONGO_URI = your_mongodb_atlas_uri
JWT_SECRET = your_secret_key
PAYPAL_CLIENT_ID = your_paypal_client_id
PAYPAL_APP_SECRET = your_paypal_app_secret
PAYPAL_API_URL = https://api-m.sandbox.paypal.com
PAGINATION_LIMIT = 8
```

### 3. Seed the database

```bash
npm run data:import   # Load bars, events, products, users
npm run data:destroy  # Clear all seed data
```

Default admin login: `admin@email.com` / `123456`

### 4. Start development servers

```bash
npm run dev   # Runs backend (:8000) and frontend (:3000) concurrently
```

## Key Routes

| Path | Description |
|------|-------------|
| `/` | Homepage — countdown, carousel, team |
| `/bars` | Bar listing |
| `/events` | Event listing |
| `/events/:id` | Event detail + RSVP |
| `/shop` | Merchandise shop |
| `/register` | Create account |
| `/login` | Sign in |
| `/profile` | User profile + orders + RSVPs |
| `/admin` | Admin dashboard |
| `/admin/carousel` | Manage carousel images |
| `/admin/bars` | Manage bar listings |
| `/admin/events` | Manage events |

## Deployment

### Netlify (frontend)

1. Push to GitHub
2. Connect repo in Netlify
3. Build settings are in `netlify.toml`
4. Set `REACT_APP_API_URL` env var to your Render backend URL

### Render (backend)

1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Build command: `npm install`
4. Start command: `node backend/server.js`
5. Add all env vars from `.env`

### Image uploads

Development: images stored in `/uploads/` directory

Production: swap Multer storage to Cloudinary by replacing `uploadRoutes.js` with Cloudinary SDK.
