# FlatSplit 🏠💸

A Firebase-powered PWA for splitting flat expenses, tracking dues, and settling up fast.

**Live app:** https://ayushup495.github.io/FlatSplit/

## Features

- PIN/password-based login for each flatmate, with an admin role
- Multi-payer expense splits (equal, percentage, or custom)
- Category breakdown, spending analytics, and per-person balances
- Automatic "who owes who" settlement suggestions (greedy settlement algorithm)
- Excel and PDF export of expense history
- Installable as a PWA (offline app shell via service worker)
- Realtime sync across devices via Firebase Realtime Database

## Tech stack

- Vanilla HTML/CSS/JS — no build step, single-page app
- Firebase Realtime Database for sync
- SheetJS (xlsx) for Excel export
- Service worker + Web App Manifest for installability

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire app — UI, styles, and logic |
| `manifest.json` | PWA manifest (name, icons, theme) |
| `sw.js` | Service worker for offline app-shell caching |
| `icon-192.png` / `icon-512.png` | App icons |

## Running locally

Just open `index.html` in a browser, or serve the folder with any static
file server (needed for the service worker/manifest to work properly):

```bash
npx serve .
```

## Deploying

Push to a GitHub repo and enable **GitHub Pages** (Settings → Pages → Deploy
from branch → `main` / root). The app will be live at
`https://<username>.github.io/<repo>/`.

## ⚠️ Security note

This app stores member usernames/passwords in plain text inside the client-side
code and in the Firebase Realtime Database, and the Firebase config (API key,
database URL) is publicly visible in `index.html` by design (this is normal for
Firebase client apps). **This setup is fine for a small private flat-expense
tracker among people who trust each other, but it is not secure against a
motivated outsider** — anyone with the database URL and open read rules could
read the data. Before making the repo public, it's worth:

- Locking down Firebase Realtime Database rules (e.g. requiring Firebase Auth
  instead of open read/write)
- Not reusing these passwords anywhere else

## Credits

Developed by Ayush Upadhyay.
