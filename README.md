# CSV JSON Mapper

A full-stack tool to upload CSV/JSON files, map fields, transform values, preview output, and export in multiple formats.

## Features

- Upload CSV or JSON files
- Optional two-file merge (single, append, join)
- Field mapping UI with include/exclude controls
- Per-field transforms:
  - default value
  - type cast
  - prefix/suffix
- Preview as table or raw output
- Export formats:
  - `JSON` (array)
  - `CSV`
  - `JSON (Object map)` with configurable key/value strategy
- Optional API push via proxy endpoint

## JSON (Object map) mode

This generalized transformation lets you convert array rows into a keyed object.

You can configure:

- `Key field`: which field becomes the object key
- `Value mode`:
  - `Full object` -> `{ "key": { ...row } }`
  - `Single field` -> `{ "key": row[valueField] }`

Example:

Input rows:

```json
[
  { "value": "Burgenland", "sap_value": "B" },
  { "value": "Corinthia", "sap_value": "K" }
]
```

Config:

- key field: `value`
- value mode: `single field`
- value field: `sap_value`

Output:

```json
{
  "Burgenland": "B",
  "Corinthia": "K"
}
```

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Parsing: PapaParse
- Upload middleware: Multer

## Project Structure

```text
.
├─ client/   # React app (UI, mapping, preview, export)
├─ server/   # Express API (upload, transform, proxy)
└─ package.json (npm workspaces)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run (client + server)

```bash
npm run dev
```

App URLs:

- Frontend: `http://localhost:5173`
- API server: `http://localhost:3001`

## Available Scripts

At repo root:

- `npm run dev` - run client and server together
- `npm run dev:client` - run only frontend
- `npm run dev:server` - run only backend

Inside `client/`:

- `npm run dev`
- `npm run build`
- `npm run preview`

Inside `server/`:

- `npm run dev`
- `npm run start`

## API Endpoints

- `GET /api/health` - health check
- `POST /api/upload` - upload CSV/JSON file and parse rows/fields
- `POST /api/transform` - server-side transform endpoint
- `POST /api/proxy` - forward transformed data to external API

## Notes

- CSV export uses UTF-8 BOM for better Excel character compatibility.
- CORS is configured for `http://localhost:5173` by default in `server/src/index.js`.
