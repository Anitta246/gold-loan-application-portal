# Gold Loan Application Portal

## Project Overview

The Gold Loan Application Portal is a full-stack web application developed to collect and manage gold loan applications.

The application allows customers to enter their personal details, gold details, select a loan plan, and submit their application. The system validates the entered information and calculates the maximum eligible loan amount based on gold purity, net weight, and a 75% loan-to-value limit.

The submitted applications are stored in MongoDB and can be viewed, searched, edited, and deleted from the application dashboard.

## Features

- Customer name and mobile number
- Gold gross weight and net weight
- Gold purity selection
- Loan plan selection
- Pure gold weight calculation
- Total gold value calculation
- Maximum loan amount calculation using 75% LTV
- Form validation
- Mobile number validation
- Net weight and gross weight validation
- Duplicate application check within 7 days
- Application ID generation
- Application status tracking
- Masked mobile number display
- View all loan applications
- Search applications
- Edit application details
- Delete applications
- Dashboard summary

## Technologies Used

### Frontend

- React
- Vite
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- Mongoose

### Database

- MongoDB Atlas

## Project Structure

```text
gold-loan-application-portal/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── AI_LOG.md
