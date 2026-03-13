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

## Architecture

```
src/
├── classes/                    # Rule 10: classes in own folder
│   ├── comparison-engine/      # Core comparison orchestrator
│   ├── file-parser/            # CSV/XLSX parser
│   ├── diff-report/            # Queryable result wrapper
│   └── user-session/           # Auth session wrapper
├── functions/                  # Rule 9: functions in different folders
│   ├── parse-csv/              # CSV buffer → RowRecord[]
│   ├── parse-excel/            # XLSX buffer → RowRecord[]
│   ├── match-by-key/           # Key-column row matching
│   ├── match-by-position/      # Positional row matching
│   ├── compare-cells/          # Cell-level diff detection
│   ├── detect-missing-rows/    # Missing row detection
│   ├── build-summary/          # Aggregate stats builder
│   ├── normalize-value/        # Case/whitespace normalization
│   ├── validate-file/          # Upload validation
│   ├── export-csv/             # CSV export
│   ├── export-excel/           # Excel export
│   └── allocate-buffers/       # Buffer reset wrapper
├── initializers/               # Rule 11: initializers separate
│   ├── init-config/            # Constants and limits
│   ├── init-buffers/           # Pre-allocated memory buffers
│   └── init-auth/              # NextAuth configuration
├── app/                        # Next.js App Router
├── components/                 # React UI components
├── ui/                         # shadcn/ui primitives
├── lib/                        # Utilities and hooks
└── types/                      # TypeScript type definitions
```

## Coding Rules Compliance

| # | Rule | Implementation |
|---|------|---------------|
| 1 | No recursion | All algorithms use iterative `for` loops only |
| 2 | Provable loop bounds | Every loop uses explicit `limit` variable ≤ MAX_ROWS (500K) or MAX_COLUMNS (200) |
| 3 | No dynamic allocation after init | Buffers pre-allocated in `initBuffers.ts`; `resetBuffers()` reuses memory |
| 4 | Max 60 lines/function | ESLint rule `max-lines-per-function: 60`; large logic split into hooks/helpers |
| 5 | Every return value checked | TypeScript strict mode + explicit null checks on every call |
| 6 | Zero compiler warnings | `tsconfig.json` strict + `noUnusedLocals` + ESLint `--max-warnings 0` |
| 7 | No function pointers | No callbacks/higher-order functions in core logic; React hooks are framework-level |
| 8 | Max 2 classes or 4 functions/file | Each file has 1 class or ≤4 exported functions |
| 9 | Functions in different folders | Each function group has its own folder under `functions/` |
| 10 | Classes in different folder | All classes under `classes/` in separate subfolders |
| 11 | Initializers separate from function calls | All init logic under `initializers/` in separate subfolders |

## Tech Stack

- **Next.js 14.2.21** — App Router, API routes
- **NextAuth.js 4.24.11** — Authentication
- **TypeScript 5.6.3** — Strict mode
- **Tailwind CSS 3.4.17** — Styling
- **shadcn/ui** — Component primitives (Radix-based)
- **SheetJS (xlsx) 0.18.5** — Excel read/write
- **PapaParse 5.4.1** — CSV parsing
- **Lucide React 0.468.0** — Icons

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | App URL (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | JWT secret — generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | scrypt hash — generate with `node setup.js <password>` |

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint (zero warnings enforced)
npm run lint
```
