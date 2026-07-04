# Thought Process

## Understanding the Problem

Companies deal with hundreds of documents that have expiry dates - vendor contracts, compliance certificates, insurance policies, etc. The current way of tracking these in Excel sheets or emails does not work well because nobody checks them regularly. Documents expire without anyone noticing, which causes penalties, operational delays, and audit failures.

The core problem is not about storing documents. It is about making sure critical records never expire unnoticed.

## Approach

### Step 1: Identify the Core Need

The main goal is to give managers one screen where they can instantly see:
- What is active
- What is expiring soon
- What has already expired
- What needs immediate action

Every feature decision was made with this goal in mind.

### Step 2: Choose the Right Tech Stack

I needed a stack that:
- Can be set up quickly with minimal configuration
- Does not require a separate database server
- Is production-ready and maintainable

**Why Next.js?** It combines frontend and backend in one project. API routes handle data operations, and pages handle the UI. No need to maintain two separate projects.

**Why SQLite?** No database server needed. The database is just a file. For a company with hundreds of documents (not millions), SQLite is more than enough. It also makes deployment simple.

**Why Prisma?** It provides type-safe database access with auto-completion. The schema is defined once and TypeScript types are generated automatically. This reduces bugs and speeds up development.

### Step 3: Design the Data Model

The Record model is kept simple:
- id, name, category, description, expiryDate
- createdAt and updatedAt for tracking

The status (Active, Expiring Soon, Expired) is not stored in the database. It is computed on the fly based on the current date. This way, the status is always accurate without needing to update records as time passes.

### Step 4: Build Features in Order

1. **Database setup first** - Schema, migrations, seed data. Without this, nothing else works.
2. **Record management** - CRUD operations are the foundation. Users must be able to add and edit records.
3. **Expiry tracking** - The core feature. Records are classified and sorted by urgency.
4. **Dashboard** - The one-screen view that managers need. Summary cards and upcoming renewals.
5. **Search and filters** - Help users find specific records quickly.

### Step 5: Keep It Simple

Every page has one clear purpose:
- Dashboard shows the big picture
- Records page shows detailed list with status grouping
- Search page finds specific records
- Add/Edit forms are straightforward

The header is consistent across all pages with navigation and a global search bar.

## Architecture Decisions

### Status Classification Logic

The expiry status is computed using a helper function in `lib/expiry.ts`. It takes a date and returns "active", "expiring_soon", or "expired" based on the difference from today.

The threshold for "expiring soon" is 30 days. This is configurable in the helper function.

### Sorting by Urgency

Records are sorted so that expired items appear first, then expiring soon items, then active items. Within each group, items with fewer days remaining come first. This puts the most urgent items at the top.

### Server-Side Computation

The API computes the status and days remaining on the server side and includes them in the response. This means the frontend does not need to compute statuses separately, and the sorting logic is centralized.

## How Evaluation Criteria Are Addressed

### Core Functionality and Expiry Tracking (40%)
- Full CRUD for records
- Automatic classification into Active, Expiring Soon, Expired
- Grouped view on the records page
- Color-coded status badges and urgency indicators

### Dashboard and Business Visibility (25%)
- Summary cards showing counts by status
- Upcoming renewals list sorted by urgency
- Recently expired section
- Empty state for first-time users

### User Experience and Simplicity (20%)
- Clean, minimal UI using Tailwind CSS
- Consistent header with navigation and search
- Forms with clear validation
- Status badges with intuitive colors (green, yellow, red)

### Thought Process and Problem Solving (13%)
- This document explains the thinking behind every decision
- Focus on solving the real problem (expiry awareness), not on building a document storage system

## What I Would Add Next

Given more time, I would add:
- Email notifications for expiring records
- A calendar view for upcoming expiries
- User authentication so multiple people can use it
- Export to CSV/PDF for reporting
- Batch import from Excel files
