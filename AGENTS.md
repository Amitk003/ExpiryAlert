# Project Rules

## Commands
- npm run dev - Start development server
- npm run build - Build for production
- npm run lint - Run ESLint
- npx prisma migrate dev --name <name> - Create new migration
- npx prisma generate - Regenerate Prisma client
- npx prisma studio - Open Prisma Studio (DB GUI)

## Code Style
- Use TypeScript strict mode
- Use Tailwind CSS for styling
- No em dashes or emojis in codebase
- Keep code clean and simple
- Use simple English in documentation

## Architecture
- Next.js App Router with route handlers for API
- Prisma ORM with SQLite database
- Tailwind CSS for styling
- lib/ directory for shared utilities
- app/ directory for pages and API routes
