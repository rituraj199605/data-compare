# DataCompare — Side-by-Side File Comparison Tool

A Next.js 14 fullstack application for comparing CSV and Excel files side-by-side with detailed diff analysis, summary views, and export capabilities.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate your admin password hash
node setup.js admin
# Copy the output hash

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set ADMIN_PASSWORD_HASH to the hash from step 2
# Generate a secret: openssl rand -base64 32

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
# Login with: admin@datacompare.local / admin (or your chosen password)
```

## Features

| Feature | Description |
|---------|-------------|
| **F1 — Authentication** | Credential-based login via NextAuth with JWT sessions |
| **F2 — File Upload** | Drag-and-drop CSV/XLSX upload with validation (500K rows, 200 cols, 100MB) |
| **F3 — Comparison Config** | Key-column or positional matching, case/whitespace toggles, numeric tolerance |
| **F4 — Comparison Engine** | Server-side diffing with pre-allocated buffers for 500K rows |
| **F5 — Summary Window** | Overview stats + per-column diff counts, each column clickable |
| **F6 — Column Detail Modal** | Paginated diff view for a single column with color-coded rows |
| **F7 — Side-by-Side View** | Full table view with diff highlighting (paginated for performance) |
| **F8 — Export** | Download diff report as CSV or Excel (summary + detail sheets) |


## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint (zero warnings enforced)
npm run lint
```
