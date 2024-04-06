import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AddStudent() {
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const sendData = (e) => {
    e.preventDefault();
    const newStudent = {
      name,
      nim: parseInt(nim),
      gender,
    };

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("http://localhost:8070/student/add", newStudent)
          .then(() => {
            Swal.fire("Student has been successfully Saved!", "", "success");
            navigate("/");
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: err.message,
            });
          });
      } else if (result.isDenied) {
        Swal.fire("Details are not saved", "", "error");
      }
    });
  };

  return (
    <div className="container p-5">
      <form onSubmit={sendData}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Student Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nim" className="form-label">
            Student Nim
          </label>
          <input
            type="number"
            className="form-control"
            id="nim"
            placeholder="Enter Your Nim"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="gender">Select Your Gender</label>
          <br />
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <label className="form-check-label" htmlFor="male">
                Male
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
          </div>
        </div>
        <br />
        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
