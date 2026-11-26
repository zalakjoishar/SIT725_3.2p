// Resets the plants collection to the sample data: run with `npm run seed`
require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('./models/plant');
const seedData = require('./data/seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/plantCareHub';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    await Plant.deleteMany({});
    const inserted = await Plant.insertMany(seedData);
    console.log(`Seeded ${inserted.length} plants into ${mongoose.connection.name}.plants`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
