# ExpiryAlert

Track important business records and never miss an expiry date.

## Problem

Companies manage many documents like vendor contracts, compliance certificates, insurance policies, safety training records, machine inspection reports, and government licenses. Every document has an expiry date. Most companies track these dates in Excel sheets, emails, or shared folders. Nobody checks them regularly, so documents expire without anyone knowing. This leads to penalties, failed audits, and operational delays.

## Solution

ExpiryAlert is a web application that helps companies track important records and stay ahead of expiry dates. It automatically classifies records as Active, Expiring Soon, or Expired, and shows everything on one screen.

## Features

- **Record Management** - Add, edit, and delete records with name, category, and expiry date
- **Expiry Tracking** - Records are automatically classified as Active, Expiring Soon (within 30 days), or Expired
- **Dashboard** - See overall document status, upcoming renewals, and recently expired records at a glance
- **Search** - Search records by name or description, filter by category and status

## Tech Stack

- **Framework** - Next.js 16 with App Router
- **Language** - TypeScript
- **Database** - SQLite (via Prisma ORM)
- **Styling** - Tailwind CSS v4
- **ORM** - Prisma 7 with better-sqlite3 adapter

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Amitk003/ExpiryAlert.git
   cd ExpiryAlert
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the environment file:
   ```
   cp .env.example .env
   ```

4. Set up the database and seed sample data:
   ```
   npx prisma db push
   npm run seed
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

### Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run seed` | Add sample records to database |
| `npx prisma db push` | Apply database schema |
| `npx prisma studio` | Open database GUI |

## Project Structure

```
ExpiryAlert/
  app/                    # Pages and API routes
    api/
      records/            # CRUD API for records
      stats/              # Dashboard stats API
    records/              # Record list, add, edit pages
    search/               # Search page
    page.tsx              # Dashboard page
    layout.tsx            # Root layout
  components/
    Header.tsx            # Shared navigation header
  lib/
    prisma.ts             # Prisma client setup
    expiry.ts             # Expiry status helpers
  prisma/
    schema.prisma         # Database schema
    seed.ts               # Sample data seeder
```

## How Expiry Tracking Works

Records are classified into three statuses based on their expiry date:

- **Active** - Expiry date is more than 30 days away
- **Expiring Soon** - Expiry date is within 30 days
- **Expired** - Expiry date has passed

The status is computed dynamically. It is not stored in the database, so it always shows the current state based on today's date.
