# Development Logs

## Branch: main - Project Setup

### Commands Run
```powershell
# Initialize git repo
git init

# Set remote
git remote add origin https://github.com/Amitk003/ExpiryAlert.git

# Create Next.js project (temporarily named temp-project due to capital letter restriction)
npx create-next-app@latest temp-project --typescript --tailwind --eslint --app --import-alias "@/*" --use-npm --no-turbo

# Move files from temp-project to root
Get-ChildItem -Path "." -Force | Where-Object { $_.Name -ne ".git" } | ForEach-Object {
  $dest = Join-Path "C:\Users\amitk\Documents\Hackathons\ExpiryAlert" $_.Name
  Move-Item -LiteralPath $_.FullName -Destination $dest -Force
}

# Remove temp directory
Remove-Item -LiteralPath "C:\Users\amitk\Documents\Hackathons\ExpiryAlert\temp-project" -Recurse -Force

# Rename branch to main
git branch -m master main

# Remove default CLAUDE.md
Remove-Item -LiteralPath "CLAUDE.md" -Force
```

### Packages Installed
```
npm install @prisma/client
npm install -D prisma
npm install dotenv (already present as prisma dependency)
npm install @prisma/adapter-better-sqlite3 better-sqlite3
npm install -D @types/better-sqlite3
```

### Database Setup
```
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
```

### Files Created
- `prisma/schema.prisma` - Database schema with Record model
- `lib/prisma.ts` - Prisma client singleton with better-sqlite3 adapter
- `app/layout.tsx` - Root layout with clean styling
- `app/page.tsx` - Dashboard placeholder
- `app/globals.css` - Tailwind CSS import
- `.env.example` - Environment variable template
- `AGENTS.md` - Project conventions

---

## Branch: feature/database-setup

### Commands Run
```powershell
git checkout -b feature/database-setup
```

### Files Created/Modified
- `prisma/seed.ts` - Seed script with 15 sample records across 8 categories
- `lib/expiry.ts` - Helper functions for expiry status, days calculation, date formatting
- `package.json` - Added "seed" script and prisma seed config

### Database Path Fixes
- Discovered Prisma v7 uses adapter URL resolution differently
- Fixed path in seed script to use `url: "file:./dev.db"`
- Applied schema with `npx prisma db push`
- Seeded 15 records successfully

### Packages Installed
```
npm install -D tsx
```

### Seed Command
```
npm run seed
```

---

## Branch: feature/record-management

### Commands Run
```powershell
git checkout -b feature/record-management
```

### Files Created
- `app/api/records/route.ts` - GET (list with search/category filter), POST (create)
- `app/api/records/[id]/route.ts` - GET (single), PUT (update), DELETE
- `app/records/page.tsx` - Records list with table, search, category filter, status badge, edit/delete actions
- `app/records/new/page.tsx` - Add record form
- `app/records/[id]/edit/page.tsx` - Edit record form

### TypeScript Fixes
- Renamed local `Record` type to `RecordItem` to avoid conflict with Prisma-generated Record type

---

## Branch: feature/expiry-tracking

### Commands Run
```powershell
git checkout -b feature/expiry-tracking
```

### Files Modified
- `app/api/records/route.ts` - Server now computes status and daysUntilExpiry, sorts by urgency priority
- `app/records/page.tsx` - Records grouped into Expired/Expiring Soon/Active sections, summary cards at top, urgency-based color indicators

---

## Branch: feature/dashboard

### Commands Run
```powershell
git checkout -b feature/dashboard
```

### Files Created
- `app/api/stats/route.ts` - Server endpoint for dashboard data (counts, upcoming, recently expired)

### Files Modified
- `app/page.tsx` - Full dashboard with 4 summary cards, upcoming renewals list, recently expired list, empty state

---

## Branch: feature/search-filter

### Commands Run
```powershell
git checkout -b feature/search-filter
```

### Files Created
- `components/Header.tsx` - Shared header with logo, nav links, global search bar
- `app/search/page.tsx` - Search results page with category and status filters

### Files Modified
- `app/page.tsx` - Replaced inline header with shared Header component
- `app/records/page.tsx` - Replaced inline header with shared Header component
- `app/records/new/page.tsx` - Replaced inline header with shared Header component
- `app/records/[id]/edit/page.tsx` - Replaced all 3 inline headers with shared Header component
- `app/api/records/route.ts` - Added server-side status filter parameter

### TypeScript Fixes
- Wrapped useSearchParams() in Suspense boundary on search page to fix prerender error

---

## Branch: feature/documentation

### Commands Run
```powershell
git checkout -b feature/documentation
```

### Files Created
- `README.md` - Project documentation
- `THOUGHT_PROCESS.md` - Problem-solving approach and architecture decisions
- `LOGS.md` - This file, documenting all commands and changes
