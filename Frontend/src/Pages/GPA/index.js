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
        console.log("Fetching student by ID:", sid);
        const response = await axios.get(
          `http://localhost:8070/student/get/${sid}`
        );
        console.log("Student response:", response.data);
        setStudent(response.data.user);

        // Fetch GPA records for the student from the student object
        setGpa(response.data.user.gpa || []);
      } catch (err) {
        console.error("Error fetching student and GPA data:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      }
    };
    fetchStudentAndGpa();
  }, [sid]);

  // Update GPA for a student
  const saveGpa = async () => {
    try {
      // Extract GPA values from the form inputs
      const gpaValues = Array.from(
        { length: student.semestersCleared || 0 },
        (_, i) => {
          const gpaInput = document.getElementById(`gpa-${i + 1}`);
          return parseFloat(gpaInput.value) || 0; // Use 0 if the input is empty
        }
      );

      console.log("Extracted GPA values from form:", gpaValues);

      // Update the GPA array in the student object
      const updatedStudent = { ...student, gpa: gpaValues };

      // Send a PUT request to update the student object
      const response = await axios.put(
        `http://localhost:8070/student/update/${sid}`,
        updatedStudent
      );

      console.log("GPA update response:", response.data);
      Swal.fire("GPA updated successfully!", "", "success");
      navigate("/");
    } catch (err) {
      console.error("Error updating GPA data:", err);
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
        {Array.from({ length: student.semestersCleared || 0 }, (_, i) => i + 1).map(
          (sem) => (
            <div key={sem} className="mb-3">
              <label htmlFor={`gpa-${sem}`} className="form-label">
                GPA for Semester {sem}
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id={`gpa-${sem}`}
                placeholder={(gpa && gpa[sem - 1]) ? gpa[sem - 1] : "Enter GPA"}
              />
              {/* Added console log to check extracted GPA values on form submit */}
              <input type="hidden" value={sem} id={`semester-${sem}`} />
            </div>
          )
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            console.log("Clicked Save GPA button");
            saveGpa();
          }}
        >
          Save GPA
        </button>
      </form>
    </div>
  );
}
