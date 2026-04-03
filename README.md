# SmartShop - Full-Stack POS System

A professional, full-stack Point of Sale (POS) and Inventory Management system built with Node.js, Express, PostgreSQL, Prisma, and React Native (Expo).

## 🚀 Features
- **Authentication & Authorization**: Role-based access control (ADMIN, STAFF) using JWT.
- **Inventory Management**: Track products, stock levels, and get low-stock alerts.
- **Point of Sale (POS)**: Seamless checkout system with automatic inventory sync.
- **Customer Management**: CRM to track customers and their purchase history.
- **Analytics & Reporting**: Sales summaries, revenue tracking, and inventory health dashboards.

## 🛠️ Technology Stack
- **Backend**: Node.js, Express, TypeScript, Zod, Prisma, PostgreSQL
- **Mobile**: React Native, Expo, React Navigation, Axios, Async Storage

## 📂 Project Structure
- `/backend`: Node.js REST API server
- `/mobile`: React Native Expo mobile application

## ⚙️ Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Expo App on your mobile device (or iOS Simulator / Android Emulator)

## 🏃‍♂️ Getting Started

### 1. Backend Setup
```bash
cd backend
npm install

# Set up your .env file with DATABASE_URL and JWT_SECRET
# Example: DATABASE_URL="postgresql://user:password@localhost:5432/smartshop"

# Initialize database
npx prisma generate
npx prisma db push

# Run the server (starts on http://localhost:3000)
npm run dev
```

### 2. Mobile Setup
```bash
cd mobile
npm install

# Start the Expo bundler
npx expo start
```

*Note: If you are testing on a physical device, make sure your mobile phone and computer are on the same Wi-Fi network. You may need to update the base URL in `mobile/src/api/client.ts` from `localhost` to your computer's local IP address (e.g., `192.168.1.x`).*

## 🤝 Project Status
MVP Completed. Ready for production staging and continuous integration.
