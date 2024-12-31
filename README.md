# DropIt - Anonymous Messaging Platform

## Overview
DropIt is a web application that enables anonymous messaging and feedback sharing. Users can create accounts, receive anonymous messages, and manage their inbox.

## [Live Project](https://feast-flow-project.vercel.app/)

## ✨ Features

### User Management
- Secure user authentication with email/username login
- Username availability checking in real-time
- Email verification system for new accounts
- Customizable message acceptance settings

### Dashboard
- Unique profile links for receiving messages
- Real-time message filtering and search
- Message management (view, delete)
- Toggle message acceptance status

### AI-Powered Features
- Dynamic message generation using Google's Gemini 1.5 Pro

## Tech Stack

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database Integration**: API routes with [Axios](https://axios-http.com/)
- **Authentication**: JWT-based authentication system

## 🚀 Key Features Implementation

- **Smart Caching**: Local storage caching for food items with configurable duration
- **Seamless Cart Sync**: Real-time synchronization between local storage and database
- **Live Updates**: Automatic polling for order status changes

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB connection
- Google AI API key (for AI features)

## 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/Ahmed-Niyaz/FeastFlow.git
cd FeastFlow
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
STRIPE_API_SECRET="your_stripe_api_secret"
NEXT_PUBLIC_API_URL="your_api_url"
```
use http://localhost:3000 for "NEXT_PUBLIC_API_URL" for local development

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser
