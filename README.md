# Leaf Ledger – SIT725 Task 3.2P

A plant care dashboard built with **Express** (server) and **Materialize** (UI).
The page calls a **GET REST endpoint** (`/api/plants`) and builds the whole dashboard from the response.

## Run it

```bash
npm install
npm start
```

Open http://localhost:3000 (the raw API is at http://localhost:3000/api/plants).

## Features

- Fixed Materialize **sidenav** with filters (collapses to a menu button on small screens)
- **Search** box that filters plants as you type
- **Summary tiles** calculated from the API data (total plants, easy-care plants, plants that need water this week)
- **Tabs** to filter by All / Easy care / Low light / Sun lovers
- **Horizontal cards** with a difficulty badge and a "Care guide" button
- **Care guide modal** with the plant's details in a Materialize collection
- **Floating action button** with a tooltip that opens the **Add a plant** form (text input, select, range slider, radio buttons, textarea)
- New plants appear in the list straight away and a **toast** confirms them (no POST endpoint yet, so they are not saved on the server)

## Folder structure

```
leaf-ledger/
├── server.js            # Express server + GET /api/plants
├── package.json
├── public/
│   ├── index.html       # Materialize layout: sidenav, search, stats, tabs, cards, modals, FAB
│   ├── css/styles.css   # Leaf Ledger theme
│   ├── js/scripts.js    # Calls the API with $.get, renders cards, filters, search, modals, form
│   └── images/          # Plant illustrations (SVG)
└── .gitignore
```

## API response shape

```json
{ "statusCode": 200, "data": [ { "title": "...", "image": "...", "description": "...", "light": "...", "lightLevel": "low|medium|high", "water": "...", "waterDays": 7, "difficulty": "Easy|Moderate" } ], "message": "Success" }
```
