# 🟡 Gold Loan Application Portal

A full-stack web application for collecting gold loan applications and calculating preliminary loan eligibility based on gold weight, purity, and loan scheme.

## 🚀 Features

- Customer details collection
- Gross and Net Gold Weight input
- Gold purity selection: 18K, 22K, 24K
- Pure gold weight calculation
- Gold value calculation
- Maximum eligible loan calculation using 75% LTV
- Bullet Repayment Plan
- Monthly EMI Plan
- Input validation
- Duplicate application check within 7 days
- MongoDB data storage
- View all applications
- Search applications
- Edit applications
- Delete applications
- Dashboard summary
- Masked mobile numbers
- Application ID confirmation

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express.js
- Mongoose
- MongoDB

## 📁 Project Structure

```text
gold-loan-portal/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── AI_LOG.md