# Shopping App

A small React + TypeScript + Vite shopping app with:
- product loading from `json-server`
- real-time search
- cart quantity controls
- `localStorage` cart persistence

## Quick start

```bash
npm install
npm run start
```
OR
```bash
bun install
bun start
```

This starts:
- Vite on `http://localhost:5173`
- `json-server` on `http://localhost:3001`

### Scripts

```bash
npm run start
npm run dev
npm run server
npm run lint
npm run build
```
```bash
bun start
bun dev
bun server
bun lint
bun build
```

## Notes

- The app fetches products directly from `http://localhost:3001/products`.
- `json-server` returns string ids, and the app normalizes them to numbers before storing products in state.
