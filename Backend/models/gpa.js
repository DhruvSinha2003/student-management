const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gpaSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  gpa: {
    type: [Number],
    required: true
  }
});

const GPA = mongoose.model('GPA', gpaSchema);

module.exports = GPA;