import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

export default function GPA() {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [gpa, setGpa] = useState([]);

  useEffect(() => {
    const fetchStudentAndGpa = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/student/get/${sid}`); // Fetch student details using sid
        setStudent(response.data.user); // Assuming the user object contains the student details
        const gpaResponse = await axios.get(`http://localhost:8070/student/${sid}/gpa/get`); // Fetch GPA records using sid
        setGpa(gpaResponse.data); // Assuming the response contains an array of GPA records
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      }
    };
    fetchStudentAndGpa();
  }, [sid]);

  const saveGpa = async () => {
    try {
      for (let i = 0; i < student.semester; i++) {
        const gpaValue = parseFloat(document.getElementById(`gpa-${i + 1}`).value);
        const response = await axios.post(`http://localhost:8070/student/${student._id}/gpa/add`, {
          semester: i + 1,
          gpa: gpaValue,
        });
        console.log(response.data); // Log the response data from the server
      }
      Swal.fire("GPA saved successfully!", "", "success");
      navigate("/");
    } catch (err) {
      console.error(err); // Log the error for debugging
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    }
  };

  return (
    <div className="container p-5">
      <h2>GPA for {student.name}</h2>
      <form>
        {Array.from({ length: student.semester || 0 }, (_, i) => i + 1).map((sem) => (
          <div key={sem} className="mb-3">
            <label htmlFor={`gpa-${sem}`} className="form-label">
              GPA for Semester {sem}
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id={`gpa-${sem}`}
              placeholder="Enter GPA"
              defaultValue={
                gpa.find((g) => g.semester === sem)?.gpa || ""
              }
            />
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={saveGpa}>
          Save GPA
        </button>
      </form>
    </div>
  );
}