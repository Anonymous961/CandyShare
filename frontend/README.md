# CandyShare Frontend

The frontend application for CandyShare, built with Next.js 14, React, and TypeScript.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **File Upload**: Drag-and-drop file upload with progress tracking
- **User Authentication**: Secure login/signup with NextAuth
- **Dashboard**: Comprehensive file management and analytics
- **Payment Integration**: Pro tier subscription with Razorpay
- **Analytics**: Interactive charts and usage statistics
- **QR Code Generation**: Easy file sharing via QR codes
- **Password Protection**: Secure file sharing options

## Prerequisites

- Node.js 18+
- Backend API running on port 4000

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Required environment variables:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── download/          # File download pages
│   ├── results/           # File sharing results
│   └── *-policy/          # Legal policy pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── store/                # State management
└── types/                # TypeScript type definitions
```

## Key Components

- **FileUploadCard**: Main file upload interface
- **UserDashboard**: User file management dashboard
- **AnalyticsTab**: File usage analytics and charts
- **PaymentModal**: Pro tier subscription modal
- **PasswordProtection**: File password protection
- **QRSection**: QR code generation for sharing

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

Or build and deploy manually:

```bash
npm run build
npm run start
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Razorpay Integration](https://razorpay.com/docs)
