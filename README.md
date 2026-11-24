# Plant Care Hub – SIT725 Task 3.2P

A small web app built with **Express** (server) and **Materialize** (UI).
The page calls a **GET REST endpoint** (`/api/plants`) and shows each plant as a Materialize card.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.
The API on its own is at http://localhost:3000/api/plants

## Folder structure

```
plant-care-hub/
├── server.js            # Express server + GET /api/plants
├── package.json
├── public/
│   ├── index.html       # Materialize page (navbar, hero, cards, modal form, footer)
│   ├── css/styles.css
│   ├── js/scripts.js    # Calls the API with $.get and builds the cards
│   └── images/          # Plant illustrations (SVG)
└── .gitignore           # node_modules is not pushed
```

## API response shape

```json
{ "statusCode": 200, "data": [ { "title": "...", "image": "...", "link": "...", "description": "...", "light": "...", "water": "..." } ], "message": "Success" }
```
