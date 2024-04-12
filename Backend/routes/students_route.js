const router = require('express').Router();
const Student = require('../models/student');
const GPA = require('../models/gpa');

// Add a new student
router.route('/add').post(async (req, res) => {
  const { name, nim, gender, semester } = req.body;

  try {
    // Create a new student
    const newStudent = new Student({ name, nim, gender, semester });
    await newStudent.save();

    // Create a new GPA record associated with the student
    const newGPA = new GPA({
      student: newStudent._id,
      semester
    });
    await newGPA.save();

    // Update the student's GPA reference
    newStudent.gpa = newGPA._id;
    await newStudent.save();

    res.status(201).json({ message: 'Student and GPA record added successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with adding student and GPA record', error: err.message });
  }
});

// Get all students
router.route('/get').get((req, res) => {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({ status: 'Error with fetching students', error: err.message });
    });
});

// Update a student
router.route('/update/:sid').put(async (req, res) => {
  const userID = req.params.sid;
  const { name, nim, gender } = req.body;
  const updateStudent = { name, nim, gender };

  try {
    await Student.findByIdAndUpdate(userID, updateStudent);
    res.status(200).send({ status: 'User Updated' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Server Error with updating data', error: err.message });
  }
});

// Delete a student
router.route('/delete/:sid').delete(async (req, res) => {
  const uId = req.params.sid;

  try {
    await Student.findByIdAndDelete(uId);
    res.status(200).send({ status: 'User Deleted' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with deleting user', error: err.message });
  }
});

// Get a specific student
router.route('/get/:sid').get(async (req, res) => {
  const uID = req.params.sid;

  try {
    const user = await Student.findById(uID);
    res.status(200).send({ status: 'User Fetched', user });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching user', error: err.message });
  }
});

// Add a new GPA record for a student
router.route('/student/:sid/gpa/add').post(async (req, res) => {
  const studentId = req.params.sid;
  const { semester, gpa } = req.body;

  try {
    const newGPA = new GPA({
      semester,
      gpa
    });

    await newGPA.save();

    // Update the student's GPA array
    const student = await Student.findById(studentId);
    student.gpa.push(newGPA._id);
    await student.save();

    res.status(201).json({ message: 'GPA record added successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with adding GPA record', error: err.message });
  }
});

// Get all GPA records for a student
router.route('/student/:sid/gpa/get').get(async (req, res) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('gpa');
    res.status(200).json(student.gpa);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching GPA records', error: err.message });
  }
});

// Update a GPA record for a student
router.route('/student/:sid/gpa/:gpaid/update').put(async (req, res) => {
  const studentId = req.params.sid;
  const gpaId = req.params.gpaid;
  const { semester, gpa } = req.body;

  try {
    await GPA.findByIdAndUpdate(gpaId, { semester, gpa });
    res.status(200).json({ message: 'GPA record updated successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with updating GPA record', error: err.message });
  }
});

// Delete a GPA record for a student
router.route('/student/:sid/gpa/:gpaid/delete').delete(async (req, res) => {
  const studentId = req.params.sid;
  const gpaId = req.params.gpaid;

  try {
    // Remove the GPA record from the student's gpa array
    const student = await Student.findById(studentId);
    student.gpa.pull(gpaId);
    await student.save();

    // Delete the GPA record
    await GPA.findByIdAndDelete(gpaId);
    res.status(200).json({ message: 'GPA record deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with deleting GPA record', error: err.message });
  }
});

module.exports = router;