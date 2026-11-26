# Plant Care Hub – SIT725 Task 4.2P (Add a database)

Plant Care Hub now stores its plants in **MongoDB** (through **Mongoose**) and all the logic runs on the **server**.
The Materialize front end only displays what the API sends back.

## What changed from 3.2P

| Before (3.2P) | Now (4.2P) |
|---|---|
| Plants hard-coded in an array in `server.js` | Plants stored in the MongoDB `plants` collection |
| Filtering, searching and counting done in the browser | Done on the server with MongoDB queries (`find`, `countDocuments`) |
| Add form only kept the plant in the browser | `POST /api/plants` validates and saves it in MongoDB |
| No way to remove a plant | `DELETE /api/plants/:id` |

## Data model (`models/plant.js`)

| Field | Type | Notes |
|---|---|---|
| `name` | String | required, max 60 characters |
| `scientificName` | String | optional |
| `image` | String | defaults to `images/default-plant.svg` |
| `lightLevel` | String | `low`, `medium` or `high` |
| `waterEveryDays` | Number | 1–60 |
| `difficulty` | String | `Easy`, `Moderate` or `Hard` |
| `petSafe` | Boolean | safe for cats and dogs |
| `careNotes` | String | |
| `createdAt`, `updatedAt` | Date | added automatically (timestamps) |

## REST API

| Method | Route | What it does |
|---|---|---|
| GET | `/api/plants?filter=all\|easy\|low\|high\|petsafe&search=text` | List plants (filtered and searched by MongoDB) |
| GET | `/api/plants/stats` | Totals for the dashboard tiles |
| GET | `/api/plants/:id` | One plant (care guide) |
| POST | `/api/plants` | Add a plant (validated by the schema) |
| DELETE | `/api/plants/:id` | Remove a plant |

Every response has the same shape: `{ statusCode, data, message }`.

## Run it

1. Make sure MongoDB is running locally (MongoDB Community Server), or set `MONGODB_URI` to your MongoDB Atlas connection string.
2. Install and start:

```bash
npm install
npm start
```

3. Open http://localhost:3000

The first time it runs on an empty database, the server adds 8 sample plants automatically.
To reset the data back to the samples at any time: `npm run seed`

Default database: `mongodb://127.0.0.1:27017/plantCareHub`, collection `plants`.

## Folder structure

```
plant-care-hub/
├── server.js            # Express server, MongoDB connection and REST API
├── seed.js              # npm run seed: reset the collection to the sample data
├── models/plant.js      # Mongoose schema and model
├── data/seedData.js     # 8 sample plants
├── package.json
└── public/
    ├── index.html       # Materialize dashboard
    ├── css/styles.css
    ├── js/scripts.js    # Calls the API (GET, POST, DELETE) and renders the results
    └── images/          # Plant illustrations (SVG)
```
