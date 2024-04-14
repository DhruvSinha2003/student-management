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

router.route('/get-all').get(async (req, res) => {
  try {
    const students = await Student.find().populate('gpa');
    res.status(200).json(students);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching students', error: err.message });
  }
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


router.route('/student/:sid/gpa/add').post(async (req, res) => {
  const studentId = req.params.sid;
  const gpaData = req.body; // Array of GPA data

  try {
    // Fetch the student by ID
    const student = await Student.findById(studentId);

    // If the student doesn't exist, return an error
    if (!student) {
      return res.status(404).json({ status: 'Error', message: 'Student not found' });
    }

    // Create new GPA records for each semester
    for (let i = 0; i < student.semester; i++) {
      const newGPA = new GPA({
        student: student._id,
        semester: i + 1, // Semester starts from 1
        gpa: gpaData[i] // Use the GPA data from the request body
      });
      await newGPA.save();

      // Update the student's gpa array
      student.gpa.push(newGPA._id);
    }

    await student.save();

    res.status(201).json({ message: 'GPA records added successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with adding GPA records', error: err.message });
  }
});
// Get all GPA records for a specific student
router.route('/:sid/gpa/get').get(async (req, res) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('gpa');
    res.status(200).json(student.gpa);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching GPA records', error: err.message });
  }
});

router.route('/gpa/:sid').get(async (req, res) => {
  const studentId = req.params.sid;

  try {
    const student = await Student.findById(studentId).populate('gpa');
    res.status(200).json({ student, gpa: student.gpa });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ status: 'Error with fetching student and GPA', error: err.message });
  }
});

// Update a GPA record for a student
router.route('/student/:sid/gpa/:gpaid/update').put(async (req, res) => {
  const studentId = req.params.sid;
  const gpaId = req.params.gpaid;
  const gpaData = req.body; // Array of floats

  try {
    console.log("Fetching GPA record to update:", gpaId);
    const gpaToUpdate = await GPA.findById(gpaId);
    if (!gpaToUpdate) {
      return res.status(404).json({ message: 'GPA record not found' });
    }

    console.log("Updating GPA values:", gpaData);
    gpaData.forEach((newGpaValue, index) => {
      gpaToUpdate.gpa[index] = newGpaValue; // Assuming 'gpa' is an array in the GPA model
    });

    console.log("Saving updated GPA record:", gpaToUpdate);
    await gpaToUpdate.save();
    res.status(200).json({ message: 'GPA record updated successfully' });
  } catch (err) {
    console.error("Error updating GPA record:", err.message);
    res.status(500).send({ status: 'Error with updating GPA record', error: err.message });
  }});


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