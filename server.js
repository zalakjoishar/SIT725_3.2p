require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Plant = require('./models/plant');
const seedData = require('./data/seedData');

const app = express();
const port = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plantCareHub';

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------- Helpers (all the logic now lives on the server) ----------

// Same response shape as before: { statusCode, data, message }
const send = (res, statusCode, data, message) => res.status(statusCode).json({ statusCode, data, message });

// Escape user text before using it in a regular expression search
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Turn ?filter=...&search=... into a MongoDB query
const buildQuery = ({ filter = 'all', search = '' }) => {
  const query = {};
  if (filter === 'easy') query.difficulty = 'Easy';
  if (filter === 'low' || filter === 'high') query.lightLevel = filter;
  if (filter === 'petsafe') query.petSafe = true;
  if (search.trim()) query.name = { $regex: escapeRegex(search.trim()), $options: 'i' };
  return query;
};

// ---------- REST API ----------

// GET all plants, filtered and searched by MongoDB (newest first)
app.get('/api/plants', async (req, res) => {
  try {
    const plants = await Plant.find(buildQuery(req.query)).sort({ createdAt: -1, name: 1 });
    send(res, 200, plants, 'Success');
  } catch (err) {
    send(res, 500, null, 'Could not load plants');
  }
});

// GET summary numbers for the dashboard tiles (counted by MongoDB)
app.get('/api/plants/stats', async (req, res) => {
  try {
    const [total, petSafe, waterThisWeek] = await Promise.all([
      Plant.countDocuments(),
      Plant.countDocuments({ petSafe: true }),
      Plant.countDocuments({ waterEveryDays: { $lte: 7 } }),
    ]);
    send(res, 200, { total, petSafe, waterThisWeek }, 'Success');
  } catch (err) {
    send(res, 500, null, 'Could not load stats');
  }
});

// GET one plant for the care guide
app.get('/api/plants/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return send(res, 400, null, 'Invalid plant id');
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) return send(res, 404, null, 'Plant not found');
    send(res, 200, plant, 'Success');
  } catch (err) {
    send(res, 500, null, 'Could not load plant');
  }
});

// POST a new plant from the form (validated by the Mongoose schema)
app.post('/api/plants', async (req, res) => {
  try {
    const { name, scientificName, lightLevel, waterEveryDays, difficulty, petSafe, careNotes } = req.body;
    const plant = await Plant.create({
      name, scientificName, lightLevel, difficulty, careNotes,
      waterEveryDays: Number(waterEveryDays),
      petSafe: petSafe === true || petSafe === 'true',
    });
    send(res, 201, plant, 'Plant added');
  } catch (err) {
    if (err.name === 'ValidationError') {
      return send(res, 400, null, Object.values(err.errors).map((e) => e.message).join(', '));
    }
    send(res, 500, null, 'Could not add plant');
  }
});

// DELETE a plant
app.delete('/api/plants/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return send(res, 400, null, 'Invalid plant id');
  try {
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) return send(res, 404, null, 'Plant not found');
    send(res, 200, plant, 'Plant removed');
  } catch (err) {
    send(res, 500, null, 'Could not remove plant');
  }
});

// ---------- Start: connect to MongoDB, seed if empty, then listen ----------
const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', mongoose.connection.name);
    if ((await Plant.countDocuments()) === 0) {
      await Plant.insertMany(seedData);
      console.log(`Database was empty, so ${seedData.length} sample plants were added`);
    }
    app.listen(port, () => console.log('Plant Care Hub is running on http://localhost:' + port));
  } catch (err) {
    console.error('Could not connect to MongoDB. Is it running?', err.message);
    process.exit(1);
  }
};

if (require.main === module) start();

module.exports = { app, buildQuery };
