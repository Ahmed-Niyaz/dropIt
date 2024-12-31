# DropIt 📬

## Overview
DropIt is a web app for anonymous messaging and feedback. Users can create accounts, receive messages anonymously, and manage their inbox.

## [Live Project](https://dropit-psi.vercel.app)

## ✨ Features

### 🔐 User Management
- Secure user authentication with email/username login.
- Real-time username availability checking.
- Email verification for new accounts.
- Customizable message acceptance settings.

### 📊 Dashboard
- Unique profile links for receiving messages.
- Real-time message filtering and search.
- Message management (view, delete).
- Toggle message acceptance status.

### 🤖 AI-Powered Features
- Dynamic message generation using Google's Gemini 1.5 Pro.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database Integration**: MongoDB with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT-based)
- **HTTP Requests**: [Axios](https://axios-http.com/)

## 🚀 Key Features Implementation

- **Anonymous Messaging**: Send anonymous messages to registered users.
- **Message Search**: Search messages by keywords for easy retrieval.
- **Message Acceptance Control**: Enable or disable the acceptance of messages.
- **Profile Link System**: Unique, shareable profile links for receiving anonymous messages.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A MongoDB instance
- Google AI API key (for AI features)

## 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/Ahmed-Niyaz/dropIt.git
cd dropIt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file with the following variables:
```
MONGO_URI='MONGO_URI'
RESEND_API_KEY='YOUR_RESEND_KEY'
AUTH_SECRET='YOUR_SECRET_KEY'
GOOGLE_GENERATIVE_AI_API_KEY='YOUR_KEY'
GOOGLE_API_KEY='YOUR_GOOGLE_API_KEY'
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser
