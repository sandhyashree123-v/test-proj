# AI Skills Discovery & Browsing Catalog + Certificate Verification (Version 2)

A full-stack demo application with two independent features:

1. **AI Skills Catalog** (US-1–US-5) — browse, search, and filter a seeded catalog of
   reusable AI skills, and view full detail for any skill.
2. **Certificate Verification** (US-6, NEW in Version 2) — a public, no-login page where
   anyone with a certificate ID can confirm a learner's completion status.

Mock/local authentication only — there is no real login system in this build for either
feature (the catalog has no auth concept at all; certificate verification is explicitly
public by design).

## Tech Stack

- **Backend**: Node.js + Express, `better-sqlite3` (SQLite), `cors`
- **Backend testing**: Jest + Supertest
- **Frontend**: React 18 + Vite, `react-router-dom`, Tailwind CSS + Heroicons
- **Frontend testing**: Vitest + React Testing Library
- **Repo structure**: Monorepo — `server/` (API) + `client/` (SPA)

## Project Structure

```
code/v2/
├── server/               # Express API
│   ├── src/
│   │   ├── db/           # SQLite connection + schema
│   │   ├── models/       # Row <-> object mapping
│   │   ├── repositories/ # Data access (skills, certificates)
│   │   ├── services/     # Business logic orchestration
│   │   ├── controllers/  # HTTP request/response shaping
│   │   ├── routes/       # Express route declarations
│   │   ├── seed/         # Fixed startup seed data + loader
│   │   ├── app.js        # Express app assembly
│   │   └── server.js     # Entry point (seeds DB, starts listening)
│   └── tests/
└── client/               # React SPA
    └── src/
        ├── api/           # ApiClient (fetch wrapper)
        ├── components/    # Shared + feature components
        ├── pages/         # Top-level routed pages
        ├── tests/
        └── App.jsx, main.jsx
```

## Getting Started

### 1. Install dependencies

From `code/v2/`:

```bash
npm run install:all
```

This installs dependencies in both `server/` and `client/`.

### 2. Run the app (both backend and frontend together)

```bash
npm run dev
```

This starts:
- The Express API on **http://localhost:4000** (seeds the SQLite database on first boot)
- The Vite dev server on **http://localhost:5173**, proxying `/api/*` requests to the
  backend — no manual configuration needed, open **http://localhost:5173** in your browser.

To run them individually instead:

```bash
npm run dev --prefix server   # API only, port 4000
npm run dev --prefix client   # SPA only, port 5173
```

### 3. Run tests

```bash
npm test                 # backend + frontend
npm run test:server      # backend only (Jest)
npm run test:client      # frontend only (Vitest)
```

## Trying the Catalog (US-1–US-5)

- Visit `/` to browse all 12 seeded skills across 4 categories (Productivity, Data &
  Analytics, Customer Support, Engineering).
- Use the search box to keyword-match across name, description, and tags.
- Use the category/tag dropdowns to filter (combined with AND when both are set).
- Click any skill card to view its full detail page.

## Trying Certificate Verification (US-6)

Visit `/verify-certificate` (or click "Verify Certificate" in the nav bar). No login is
required. Try these seeded certificate IDs:

| Certificate ID   | Status  | Learner         |
|-------------------|---------|-----------------|
| `CERT-2024-00101` | Valid   | Alice Chen      |
| `CERT-2024-00102` | Valid   | Brian Osei      |
| `CERT-2024-00103` | Revoked | Carla Nguyen    |
| `CERT-2024-00104` | Expired | Dinesh Rao      |
| `CERT-2024-00105` | Valid   | Elena Petrova   |
| `CERT-2024-00106` | Expired | Farah Haddad    |

A **Revoked** or **Expired** certificate still returns its full detail (it genuinely
exists) — only an ID with no matching record returns "Certificate not found". Try
`CERT-2024-99999` (deliberately not seeded) to see the not-found state.

## API Surface

| Method | Path | Notes |
|---|---|---|
| GET | `/api/skills` | Query params: `q`, `category`, `tag`, `page` (all optional). Fixed page size of 12. |
| GET | `/api/skills/:id` | Full skill detail, or 404 if not found. |
| GET | `/api/certificates/:certificateId` | Exact-match lookup. 200 with full detail for any found status; 404 generic "Certificate not found" otherwise. |

See `artifacts/build/docs/api-reference.md` for full request/response examples.

## Environment Variables (server)

See `server/.env.example`. `DB_PATH` defaults to `./data/catalog.db` if unset; `PORT`
defaults to `4000`.
