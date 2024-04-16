  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const studentSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    nim: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    semestersCleared: {
      type: Number,
      required: true
    },
    gpa: {
      type: Object, 
      required: false 
    }
  });


  const Student = mongoose.model('Student', studentSchema);

  module.exports = Student;
