<div align="center">

# 📚 Bookish

### A modern online book store  browse, order and track books, with a full admin panel

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![Google Sign-In](https://img.shields.io/badge/Google-Sign--In-4285F4?logo=google&logoColor=white)


</div>

---

## ✨ Overview

**Bookish** is a full-stack e-commerce web app built with the MERN stack. Customers can discover books, add them to a cart or wishlist, check out, and follow their order from *Placed* to *Delivered*. Admins get a dedicated panel to manage the catalogue, categories and orders.

The design is deliberately calm and bookish: warm paper-white pages, a navy header, maroon call-to-action buttons and serif headings.

<!--
## 📸 Screenshots
Add your own screenshots to a `screenshots/` folder, then uncomment this block:

| Home | Book details |
|---|---|
| ![Home](screenshots/home.png) | ![Book](screenshots/book.png) |
-->

---

## 🎯 Features

### 🛍️ For customers

| | Feature |
|---|---|
| 🏠 | **Home page** with hero banner, category chips, featured and newly added books |
| 🔎 | **Search, filter & sort** — by title/author, category, price range; sort by newest, price or rating; pagination |
| 📖 | **Book details** — price, discount, stock status, ratings, reviews and related books |
| 🛒 | **Cart** — change quantities, remove items, live order summary (free delivery over ₹499, otherwise ₹49) |
| ❤️ | **Wishlist** — "save for later" |
| 🔐 | **Accounts** — sign up and log in with email, or continue with **Google** |
| 💳 | **Checkout** — delivery address with pincode/phone validation, Cash on Delivery |
| 📦 | **My orders & order tracking** — *Placed → Shipped → Delivered* stepper with a date for every stage |
| 👤 | **Profile** — edit your name and saved address |
| ⭐ | **Reviews** — one review per user per book; ratings update automatically |

### 🛠️ For admins

| | Feature |
|---|---|
| 📊 | **Dashboard** — total books, orders, revenue, customers and a low-stock list |
| 📚 | **Manage books** — add, edit, delete, feature on the homepage |
| 🚚 | **Manage orders** — see every order and update its status |
| 🗂️ | **Manage categories** — add and delete categories |

### 🔒 Security & platform

- Passwords hashed with **bcrypt**; JWT authentication; role-based admin access
- **Google Sign-In** with server-side ID-token verification
- **15-minute inactivity auto-logout** with a 60-second warning popup
- **Honeypot bot protection** on the signup and review forms
- **HTTPS redirect** in production; secrets live only in backend `.env`
- Pincode (6-digit) and phone (10-digit) validation, confirm-password on signup

### 🌐 SEO, performance & accessibility

- Meta titles/descriptions, Open Graph & Twitter preview image, favicons, `robots.txt`, sitemap generator
- **Privacy Policy** and **Terms & Conditions** pages (templates) and a **cookie-consent banner** that gates analytics
- **Code splitting** per route and lazy-loaded images for a faster first load
- Image alt text, WCAG AA colour contrast, keyboard focus styles, fully responsive, custom 404 page

---

## 🧰 Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router, Axios, Context API, Tailwind CSS 3, lucide-react, `@react-oauth/google` |
| **Backend** | Node.js, Express 5, REST API, morgan, cors, dotenv |
| **Database** | MongoDB + Mongoose |
| **Auth & security** | JSON Web Tokens, bcryptjs, `google-auth-library` |
| **Fonts** | Source Serif 4 (headings), Public Sans (body) |

---

## 📁 Project structure

```
book-selling-portal/
├── backend/
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/                 # auth, book, category, cart, order, review
│   ├── middleware/                  # auth.js (JWT), admin.js (role check)
│   ├── models/                      # User, Book, Category, Cart, Order, Review
│   ├── routes/                      # one router per resource
│   ├── scripts/                     # makeAdmin.js, deleteUser.js, generateSitemap.js
│   ├── seed/seedData.js             # sample categories, books, demo accounts
│   ├── .env.example
│   └── server.js                    # Express entry point
└── frontend/
    ├── public/                      # favicons, og-image.png, robots.txt
    ├── index.html                   # SEO / social meta tags
    └── src/
        ├── admin/                   # AdminLayout, Dashboard, ManageBooks/Orders/Categories
        ├── components/              # Navbar, Footer, BookCard, CookieConsent,
        │                            # SessionTimeoutWatcher, route guards, ...
        ├── context/                 # AuthContext, CartContext, WishlistContext
        ├── hooks/                   # useDocumentTitle
        ├── pages/                   # Home, BookList, BookDetail, Cart, Wishlist, Login,
        │                            # Signup, Checkout, MyOrders, TrackOrder, Profile,
        │                            # PrivacyPolicy, Terms, NotFound
        ├── services/api.js          # Axios instance (adds the JWT automatically)
        ├── utils/                   # format, validate, analytics
        ├── App.jsx                  # routes (lazy-loaded)
        └── main.jsx
```


---

## 🚀 Quick start

### Prerequisites

- **Node.js 18+**
- **MongoDB** — [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1️⃣ Backend

```bash
cd backend
npm install
cp .env.example .env        # Windows: copy .env.example .env
```

Open `.env` and fill in the values (see [Environment variables](#-environment-variables)). With a local MongoDB, the default `MONGO_URI` works as it is.

Load the sample data and start the server:

```bash
npm run seed
npm run dev
```

The API runs at **http://localhost:5000** — open `http://localhost:5000/api/health` and you should see `{"status":"ok"}`.

### 2️⃣ Frontend

In a **second terminal**:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Then start it:

```bash
npm run dev
```

Open **http://localhost:5173** 🎉 — in development Vite proxies `/api` to the backend, so there is no CORS setup to do.

### 3️⃣ Demo accounts (created by `npm run seed`)

| Role | Email | Password |
|---|---|---|
| 👑 Admin | `admin@bookportal.com` | `admin123` |
| 🙋 User | `reader@bookportal.com` | `reader123` |


---

## 🔧 Environment variables

### `backend/.env`

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB connection string. Local: `mongodb://127.0.0.1:27017/book-selling-portal` |
| `JWT_SECRET` | ✅ | Long random string used to sign login tokens |
| `JWT_EXPIRES_IN` | – | Token lifetime (default `7d`) |
| `PORT` | – | API port (default `5000`) |
| `GOOGLE_CLIENT_ID` | for Google login | Same Client ID as the frontend |
| `SITE_URL` | for sitemap | Your public domain, e.g. `https://yourdomain.com` |

### `frontend/.env`

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | – | API base URL. Keep `/api` in development; use the full backend URL when deployed |
| `VITE_GOOGLE_CLIENT_ID` | for Google login | Google OAuth Client ID (public by design) |
| `VITE_GA_MEASUREMENT_ID` | – | Google Analytics 4 ID (`G-XXXXXXXXXX`). Leave empty to disable analytics |

> 🔁 Restart `npm run dev` after changing any `.env` file. Never commit `.env` files — only `.env.example`.

---

## 🔑 Google Sign-In setup

1. Open [Google Cloud Console](https://console.cloud.google.com) and create (or pick) a project.
2. **APIs & Services → OAuth consent screen** → choose *External*, add an app name and your email, save.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** → type *Web application*.
4. Under **Authorized JavaScript origins** add `http://localhost:5173` (and your real domain later).
5. Copy the **Client ID** into `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend) — the same value in both.
6. Restart both servers.

Google users are matched by email: a new account is created on first sign-in, and an existing email/password account is linked automatically.

---

## 🧪 Utility scripts

Run from the `backend/` folder (MongoDB must be running).

| Command | What it does |
|---|---|
| `npm run seed` | **Wipes** users, books, categories, carts, orders and reviews, then adds 6 categories, 18 books and the two demo accounts |
| `npm run make-admin -- you@example.com` | Promotes an existing account to admin (note the `--` before the email) |
| `npm run delete-user -- admin@bookportal.com` | Deletes an account by email, e.g. to remove the demo admin |
| `npm run generate-sitemap` | Writes `frontend/public/sitemap.xml` with static pages and every book URL (set `SITE_URL` first) |

After `make-admin`, refresh the page (or log out and in again) and **Admin dashboard** appears in the account menu.

---

## 📡 API reference

<details>
<summary><b>Click to expand all endpoints</b></summary>

<br>

Base URL: `http://localhost:5000/api` — authenticated routes expect `Authorization: Bearer <token>`.

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/health` | Health check | Public |
| POST | `/auth/register` | Create account | Public |
| POST | `/auth/login` | Log in | Public |
| POST | `/auth/google` | Log in / sign up with a Google `credential` | Public |
| GET | `/auth/me` | Current user | Login |
| PUT | `/auth/profile` | Update name and address | Login |
| GET | `/auth/wishlist` | Get wishlist | Login |
| POST | `/auth/wishlist/:bookId` | Toggle a book in the wishlist | Login |
| GET | `/books` | List books — query: `search`, `category`, `minPrice`, `maxPrice`, `sort` (`newest`, `priceLowHigh`, `priceHighLow`, `rating`), `page`, `limit`, `featured` | Public |
| GET | `/books/:id` | Book detail + related books | Public |
| POST | `/books` | Create book | Admin |
| PUT | `/books/:id` | Update book | Admin |
| DELETE | `/books/:id` | Delete book | Admin |
| GET | `/categories` | List categories | Public |
| POST | `/categories` | Create category | Admin |
| DELETE | `/categories/:id` | Delete category | Admin |
| GET | `/cart` | Get cart | Login |
| POST | `/cart` | Add `{ bookId, quantity }` | Login |
| PUT | `/cart/:itemId` | Set item quantity | Login |
| DELETE | `/cart/:itemId` | Remove item | Login |
| DELETE | `/cart` | Clear cart | Login |
| POST | `/orders` | Place an order from the cart `{ address, paymentMethod }` | Login |
| GET | `/orders/:userId` | A user's orders (admins can view any) | Login |
| GET | `/orders/detail/:id` | One order (owner or admin) | Login |
| GET | `/orders/all` | Every order | Admin |
| PUT | `/orders/:id` | Update status `{ orderStatus }` | Admin |
| POST | `/reviews` | Add a review `{ bookId, rating, comment }` | Login |
| GET | `/reviews/:bookId` | Reviews for a book | Public |

Order statuses: `placed` → `shipped` → `delivered` (or `cancelled`). Every change is stored in the order's `statusHistory`, which powers the tracking page.

</details>

---

## 🧭 How it works

- **Authentication** — on login the backend returns a JWT. The frontend keeps it in `localStorage`, and the Axios instance in `services/api.js` attaches it to every request. `protect` verifies the token and `adminOnly` checks `role === "admin"`.
- **Route guards** — `ProtectedRoute` sends guests to `/login`; `AdminRoute` sends non-admins to `/`.
- **Cart & checkout** — each user's cart is stored in MongoDB. Placing an order copies the cart into an order (with a price snapshot), reduces stock and empties the cart.
- **Order tracking** — every status change is saved with a timestamp, and the tracking page turns it into a step-by-step timeline.
- **Inactivity timeout** — `SessionTimeoutWatcher` shows a warning with a 60-second countdown after 15 minutes of no activity, then logs the user out. Tweak `IDLE_TIMEOUT_MINUTES` and `WARNING_SECONDS` at the top of `frontend/src/components/SessionTimeoutWatcher.jsx`.
- **Cookies & analytics** — Google Analytics loads only after a visitor clicks *Accept* on the cookie banner.
- **Page titles** — each page sets its own browser-tab title through the `useDocumentTitle` hook.

---




| Problem | Fix |
|---|---|
| `MongoDB connection error` | Make sure `mongod` is running (local), or that your Atlas connection string is correct and your IP is allowed under *Network Access* |
| `{"message":"Route not found"}` at `localhost:5000` | That is the API, not the website — open **http://localhost:5173** |
| `Cannot find module '.../scripts/makeAdmin.js'` | The `scripts` folder must be directly inside `backend/`, not inside `config/` |
| `make-admin` / `delete-user` ignores the email | Put `--` before it: `npm run make-admin -- you@example.com` |
| Google button missing or `origin_mismatch` | Add `http://localhost:5173` to *Authorized JavaScript origins*, check `VITE_GOOGLE_CLIENT_ID`, restart the frontend |
| "Admin dashboard" missing after `make-admin` | Refresh the page, or log out and back in |
| Frontend shows "Network Error" | Check that the backend is running on port 5000 |
| Logged out right after login | Check that `JWT_SECRET` is set in `backend/.env` |
| VS Code shows `Unknown at rule @tailwind` / `@apply` | Editor-only warning. Install **Tailwind CSS IntelliSense**, or set `"css.validate": false`. The app is not affected |

</details>

---

## 📌 Current scope

- 💵 **Cash on Delivery** is the working payment method. The "Pay online" option at checkout is a placeholder with no payment gateway behind it, so it should not be used with real money.
- 🚚 The ₹49 delivery charge (orders under ₹499) is shown at checkout but is not added to the stored order total.
- 🖼️ Book covers are image URLs (the seed data uses generated placeholders); there is no file upload.

---

<div align="center">

Built as a learning project by **PRATIMESH TONDE** ❤️

⭐ If you like this project, give it a star!

</div>
