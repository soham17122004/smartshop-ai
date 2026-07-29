# 🛍️ SmartShop AI — Intelligent E-Commerce & Recommendation System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB.svg?style=flat&logo=React&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=flat&logo=Vite&logoColor=white)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/scikit_learn-1.4-F7931E.svg?style=flat&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57.svg?style=flat&logo=SQLite&logoColor=white)](https://www.sqlite.org/)

SmartShop AI is a full-stack, AI-powered e-commerce recommendation platform. It combines a high-performance **FastAPI** backend with a modern **React + Vite** frontend to deliver personalized product suggestions, intelligent search, responsive cart/wishlist management, and admin order fulfillment workflows.

---

## ✨ Key Features

### 🛒 Customer Experience
- **Public Browsing**: Explore products, categories, and brands seamlessly without requiring an account.
- **AI Recommendation Engine**: Content-based filtering using **TF-IDF + Cosine Similarity** to suggest contextually relevant products.
- **Responsive E-Commerce UI**: Built with a sleek dark/light theme system and tailored for both desktop and mobile devices.
- **Cart & Wishlist**: Real-time persistent state management with coupon discounts and subtotal computations.
- **Order Management & Tracking**: View active order statuses (`Pending`, `Dispatched`, `Delivered`, `Cancelled`), request returns, or cancel orders directly.

### 🛡️ Admin Dashboard (`/admin`)
- **Order Processing**: Real-time status update controls for orders (`Pending` ➔ `Dispatched` ➔ `Delivered` ➔ `Cancelled` ➔ `Return Requested` ➔ `Refunded`).
- **Product Catalog Management**: Add new items dynamically to the AI recommendation matrix or delete obsolete inventory.
- **Analytics & Metrics**: Insights on total sales, active orders, customer count, and product statistics.

---

## 🧠 Machine Learning Architecture

The recommendation engine computes product content similarity dynamically using natural language features:

```
[Title + Brand + Category + Description] ➔ TF-IDF Vectorization ➔ Cosine Similarity Matrix (linear_kernel) ➔ Top-N Recommendations
```

- **Algorithm**: Content-Based Filtering via Scikit-Learn `TfidfVectorizer` (5,000 max features) and `linear_kernel`.
- **Memory Optimized**: Dynamically calculates similarity matrices on demand to minimize server footprint.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (CSS variables, glassmorphism, responsive flex/grid)
- **Icons & Toast**: `react-icons`, `react-toastify`
- **Routing**: `react-router-dom` v6

### Backend
- **Framework**: FastAPI (Python 3.11)
- **ORM & Database**: SQLAlchemy + SQLite (`ecommerce.db`)
- **Authentication**: JWT Tokens + Bcrypt Password Hashing
- **Machine Learning**: `scikit-learn`, `pandas`, `joblib`

---

## 📁 Repository Structure

```
smartshop-ai/
├── backend/
│   ├── app.py                 # Primary FastAPI router & CORS config
│   ├── auth.py                # JWT Authentication routes
│   ├── database.py            # SQLite database engine connection
│   ├── orders_manager.py      # Order fulfillment & cancellation logic
│   ├── schemas.py             # Pydantic data schemas
│   ├── models/
│   │   ├── users.py           # SQLAlchemy User data model
│   │   ├── products.csv       # Product catalog dataset
│   │   └── wishlist.py        # Wishlist model
│   └── services/
│       └── recommendation.py  # TF-IDF Cosine Similarity recommendation engine
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios base instance with dynamic IP resolution
│   │   ├── components/        # Reusable UI components (Navbar, AIChatbot, ProductCard)
│   │   ├── context/           # React Context (AuthContext, ThemeContext)
│   │   ├── pages/             # App pages (Home, ProductDetails, Cart, Checkout, MyOrders, AdminDashboard)
│   │   └── styles/            # Component CSS design tokens
│   ├── index.html
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
API running at: `http://localhost:8000` (Docs at `http://localhost:8000/docs`)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend running at: `http://localhost:5173`

---

## 👤 Admin Access

- **Admin Portal**: `/admin`
- **Primary Admin Email**: `dobariyasoham@gmail.com`
- **Password**: `Soham@1712`

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
