# CandyShare Backend

The backend API server for CandyShare, built with Bun, Prisma, and PostgreSQL.

## Features

- **File Upload/Download**: Secure file handling with AWS S3
- **User Authentication**: JWT-based auth with NextAuth integration
- **Payment Processing**: Razorpay integration for Pro subscriptions
- **Analytics**: File usage tracking and statistics
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with TypeScript

## Prerequisites

- Bun runtime
- PostgreSQL database
- AWS S3 bucket
- Razorpay account

## Installation

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

Required environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/candyshare"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_BUCKET_NAME="your_s3_bucket"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
JWT_SECRET="your_jwt_secret"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

3. Generate Prisma client:

```bash
bun run db:generate
```

4. Run database migrations:

```bash
bun run db:migrate
```

5. Seed the database (optional):

```bash
bun run db:seed
```

## Development

Start the development server:

```bash
bun run dev
```

The API will be available at `http://localhost:4000`.

## API Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/files/upload` - File upload
- `GET /api/files/:id` - File download
- `GET /api/files` - User files list
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify-payment` - Verify payment
- `GET /api/analytics` - User analytics

## Database Schema

The database includes tables for:
- Users and authentication
- File metadata and storage
- Payment and subscription tracking
- Analytics and usage statistics

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run db:generate` - Generate Prisma client
- `bun run db:migrate` - Run database migrations
- `bun run db:seed` - Seed database with test data
