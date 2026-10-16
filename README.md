<div align="center">
  <h1>Organic Store</h1>
  <p><em>A robust, full-stack e-commerce platform built with the MERN stack.</em></p>

  <p>
    <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>

  <h3>
    <a href="#live-demo">Live Demo</a>
    <span> | </span>
    <a href="https://github.com/gokulra2006-del/organic-store">Repository</a>
  </h3>
</div>

---

## 📖 Overview

Organic Store is a comprehensive full-stack e-commerce solution. It features user authentication, a complete product catalog, shopping cart functionality, and secure payment processing with Razorpay, delivering a modern and seamless shopping experience.

## ✨ Key Features

- **Secure User Authentication**: Complete login and registration system with JWT and bcrypt password hashing.
- **Product Management & Shopping Cart**: Browse products, manage cart items, and proceed to checkout smoothly.
- **Payment Integration**: Secure online transactions handled via Razorpay integration.
- **Order Management & Invoicing**: Track order status and generate PDF invoices (via pdfkit).
- **Email Notifications**: Automated email updates for users (powered by Nodemailer).

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | React, Tailwind CSS, Framer Motion, Styled-components, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Authentication & Security** | JWT, bcrypt, Helmet, Express Rate Limit, XSS Clean |
| **Third-Party & Tools** | Razorpay, Nodemailer, PDFKit |

## 🏗 Architecture & Directory Structure

### System Architecture Diagram

Use this diagram to explain the complete request flow and technology layers during your faculty presentation:

![Organic Store system architecture](docs/organic-store-architecture.svg)

The main flow is: **User → React Frontend → Express API → MongoDB**, with OTP email, Razorpay payments, and real-time order tracking connected through the backend.

```text
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/       # Configurations (DB, Email, AI)
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth and Error handling middleware
│   │   ├── models/       # Mongoose DB models
│   │   ├── routes/       # API routes
│   │   └── services/     # Business logic (Email, AI, Auth)
│   └── server.js         # Backend entry point
├── public/               # Static assets
├── src/                  # React frontend client
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (Auth context)
│   ├── pages/            # Route pages
│   ├── services/         # API services (axios)
│   └── App.js            # Main React component
└── README.md
```

## 🚀 Quick Start (Local Installation)

Follow these steps to set up the project locally on your machine.

### Prerequisites
- Node.js (v18+)
- MongoDB Database (Local or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gokulra2006-del/organic-store.git
   cd organic-store
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory based on `backend/.env.example`.*
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd .. # Back to root
   npm install
   ```
   *Create a `.env` file in the root directory based on `.env.example`.*
   ```bash
   npm start
   ```

## 🔐 Environment Variables

Please refer to the `.env.example` files provided in both the root and `backend` directories for a complete list of required environment variables.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

## 👤 Author
**Gokul R**
- LinkedIn: [Gokul Ramachandran](https://www.linkedin.com/in/gokul-ramachandran-513299327/)
- GitHub: [@gokulra2006-del](https://github.com/gokulra2006-del)
