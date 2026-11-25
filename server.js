const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve the front end (HTML, CSS, JS, images) from the public folder
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Plant data returned by the REST endpoint
// lightLevel: low | medium | high   waterDays: how often to water (in days)
const plantList = [
  {
    title: 'Monstera',
    image: 'images/monstera.svg',
    description: 'Big split leaves that love bright, indirect light. Water when the top 5 cm of soil is dry and wipe the leaves now and then.',
    light: 'Bright, indirect',
    lightLevel: 'medium',
    water: 'Weekly',
    waterDays: 7,
    difficulty: 'Moderate',
  },
  {
    title: 'Snake Plant',
    image: 'images/snake-plant.svg',
    description: 'Almost impossible to kill. Handles dark corners and only needs water every two to three weeks.',
    light: 'Low to bright',
    lightLevel: 'low',
    water: 'Every 2–3 weeks',
    waterDays: 18,
    difficulty: 'Easy',
  },
  {
    title: 'Tulsi (Holy Basil)',
    image: 'images/tulsi.svg',
    description: 'A fragrant herb that wants full sun and moist soil. Pinch off the flowers to keep it bushy and leafy.',
    light: 'Full sun',
    lightLevel: 'high',
    water: 'Every 1–2 days',
    waterDays: 1,
    difficulty: 'Moderate',
  },
  {
    title: 'Aloe Vera',
    image: 'images/aloe-vera.svg',
    description: 'A succulent with soothing gel. Give it a sunny window and let the soil dry out completely between waterings.',
    light: 'Bright, direct',
    lightLevel: 'high',
    water: 'Every 2–3 weeks',
    waterDays: 18,
    difficulty: 'Easy',
  },
  {
    title: 'Money Plant',
    image: 'images/money-plant.svg',
    description: 'A fast-growing trailing vine that grows happily in water or soil. Perfect for shelves and hanging pots.',
    light: 'Medium, indirect',
    lightLevel: 'medium',
    water: 'Weekly',
    waterDays: 7,
    difficulty: 'Easy',
  },
  {
    title: 'Peace Lily',
    image: 'images/peace-lily.svg',
    description: 'Glossy leaves and white flowers. It droops when it is thirsty, so it tells you exactly when to water.',
    light: 'Low to medium',
    lightLevel: 'low',
    water: 'Weekly',
    waterDays: 7,
    difficulty: 'Easy',
  },
];

// GET endpoint consumed by the client
app.get('/api/plants', (req, res) => {
  res.json({ statusCode: 200, data: plantList, message: 'Success' });
});

app.listen(port, () => {
  console.log('Leaf Ledger is running on http://localhost:' + port);
});
