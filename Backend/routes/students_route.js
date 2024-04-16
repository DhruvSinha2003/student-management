const router = require('express').Router();
const Student = require('../models/student');

// Add a new student
router.route('/add').post(async (req, res) => {
  const { name, nim, gender, semestersCleared } = req.body;

  try {
    // Create a new student
    const newStudent = new Student({ name, nim, gender, semestersCleared });
    await newStudent.save();

    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with adding student', error: err.message });
  }
});


// Get all students
router.route('/get').get(async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching students', error: err.message });
  }
});

// Get a specific student
router.route('/get/:sid').get(async (req, res) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ status: 'Error', message: 'Student not found' });
    }
    res.status(200).json({ user: student });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching student', error: err.message });
  }
});

// Update a student
router.route('/update/:sid').put(async (req, res) => {
  const studentId = req.params.sid;
  const updateData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
    if (!updatedStudent) {
      return res.status(404).json({ status: 'Error', message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student updated successfully', user: updatedStudent });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with updating student', error: err.message });
  }
});

// Delete a student
router.route('/delete/:sid').delete(async (req, res) => {
  const studentId = req.params.sid;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ status: 'Error', message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with deleting student', error: err.message });
  }
});

module.exports = router;
