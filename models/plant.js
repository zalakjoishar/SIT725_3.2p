const mongoose = require('mongoose');

// Schema for one plant in the "plants" collection
const plantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Plant name is required'], trim: true, maxlength: 60 },
    scientificName: { type: String, trim: true, default: '' },
    image: { type: String, default: 'images/default-plant.svg' },
    lightLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    waterEveryDays: { type: Number, min: 1, max: 60, required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'], default: 'Easy' },
    petSafe: { type: Boolean, default: false },
    careNotes: { type: String, trim: true, default: '' },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model('Plant', plantSchema);
