const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve the front end (HTML, CSS, JS, images) from the public folder
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Plant data returned by the REST endpoint
const plantList = [
  {
    title: 'Monstera',
    image: 'images/monstera.svg',
    link: 'About Monstera',
    description: 'Big split leaves that love bright, indirect light. Water when the top 5 cm of soil is dry.',
    light: 'Bright, indirect',
    water: 'Weekly',
  },
  {
    title: 'Snake Plant',
    image: 'images/snake-plant.svg',
    link: 'About Snake Plant',
    description: 'Almost impossible to kill. Handles low light and only needs water every two to three weeks.',
    light: 'Low to bright',
    water: 'Every 2–3 weeks',
  },
  {
    title: 'Tulsi (Holy Basil)',
    image: 'images/tulsi.svg',
    link: 'About Tulsi',
    description: 'A fragrant herb that wants full sun and moist soil. Pinch off flowers to keep it leafy.',
    light: 'Full sun',
    water: 'Every 1–2 days',
  },
  {
    title: 'Aloe Vera',
    image: 'images/aloe-vera.svg',
    link: 'About Aloe Vera',
    description: 'A succulent with soothing gel. Give it a sunny window and let the soil dry out completely.',
    light: 'Bright, direct',
    water: 'Every 2–3 weeks',
  },
  {
    title: 'Money Plant',
    image: 'images/money-plant.svg',
    link: 'About Money Plant',
    description: 'A fast-growing trailing vine that does well in water or soil. Great for shelves.',
    light: 'Medium, indirect',
    water: 'Weekly',
  },
  {
    title: 'Peace Lily',
    image: 'images/peace-lily.svg',
    link: 'About Peace Lily',
    description: 'Glossy leaves and white flowers. It droops when thirsty, so it tells you when to water.',
    light: 'Low to medium',
    water: 'Weekly',
  },
];

// GET endpoint consumed by the client
app.get('/api/plants', (req, res) => {
  res.json({ statusCode: 200, data: plantList, message: 'Success' });
});

app.listen(port, () => {
  console.log('Plant Care Hub is running on http://localhost:' + port);
});
