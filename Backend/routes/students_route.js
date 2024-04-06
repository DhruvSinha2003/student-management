const router = require('express').Router();
const Student = require('../models/student');

// http://localhost:8070/student/add
router.route('/add').post((req, res) => {
  const { name, nim, gender } = req.body;
  const newStudent = new Student({
    name,
    nim,
    gender,
  });

  newStudent
    .save()
    .then(() => {
      res.json('Student Added Successfully');
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: 'Error with adding student',
        error: err.message,
      });
    });
});

// https://localhost:8070/student/get
router.route('/get').get((req, res) => {
  Student.find()
    .then((students) => {
      res.json(students);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).send({
        status: 'Error with fetching students',
        error: err.message,
      });
    });
});

// https://localhost:8070/student/update/:sid
router.route('/update/:sid').put(async (req, res) => {
  const userID = req.params.sid;
  const { name, nim, gender } = req.body;

  const updateStudent = {
    name,
    nim,
    gender,
  };

  try {
    await Student.findByIdAndUpdate(userID, updateStudent);
    res.status(200).send({
      status: 'User Updated',
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: 'Server Error with updating data',
      error: err.message,
    });
  }
});

// https://localhost:8070/student/delete/:sid
router.route('/delete/:sid').delete(async (req, res) => {
  const uId = req.params.sid;
  try {
    await Student.findByIdAndDelete(uId);
    res.status(200).send({
      status: 'User Deleted',
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: 'Error with deleting user',
      error: err.message,
    });
  }
});

// https://localhost:8070/student/get/:sid
router.route('/get/:sid').get(async (req, res) => {
  const uID = req.params.sid;
  try {
    const user = await Student.findById(uID);
    res.status(200).send({
      status: 'User Fetched',
      user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      status: 'Error with fetching user',
      error: err.message,
    });
  }
});

module.exports = router;
