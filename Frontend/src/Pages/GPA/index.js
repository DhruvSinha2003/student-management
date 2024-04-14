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

        console.log("Fetching GPA records for student:", sid);
        const gpaResponse = await axios.get(
          `http://localhost:8070/student/${sid}/gpa/get`
        );
        console.log("GPA response:", gpaResponse.data);
        setGpa(gpaResponse.data.gpa || []);
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

  const saveGpa = async () => {
    try {
      const gpaValues = Array.from({ length: student.semester || 0 }, (_, i) => {
        const gpaInput = document.getElementById(`gpa-${i + 1}`);
        return parseFloat(gpaInput.value) || 0; // Use 0 if the input is empty
      });

      console.log("Extracted GPA values from form:", gpaValues);

      // Check if existing GPA record exists for each semester
      let existingGpaToUpdate = null;
      for (let i = 0; i < gpa.length; i++) {
        if (gpa[i].semester === i + 1) {
          existingGpaToUpdate = gpa[i]._id;
          break;
        }
      }

      if (existingGpaToUpdate) {
        // Update existing GPA record using PUT endpoint
        console.log("Updating existing GPA record:", existingGpaToUpdate);
        const response = await axios.put(
          `http://localhost:8070/student/<span class="math-inline">\{student\.\_id\}/gpa/</span>{existingGpaToUpdate}`,
          gpaValues
        );

        // Check for successful update from the backend response (optional)
        if (response.status === 200) {
          console.log("GPA update response:", response.data);
          Swal.fire("GPA updated successfully!", "", "success");
          navigate("/");
        } else {
          console.error("Error updating GPA data on server:", response.data);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "An error occurred on the server. Please check logs.",
          });
        }
      } else {
        // Add new semester with GPA data using POST endpoint
        console.log("Adding new semester with GPA data:");
        const response = await axios.post(
          `http://localhost:8070/student/${student._id}/gpa/add`,
          gpaValues
        );

        // Check for successful update from the backend response (optional)
        if (response.status === 201) {
          console.log("GPA update response:", response.data);
          Swal.fire("GPA updated successfully!", "", "success");
          navigate("/");
        } else {
          console.error("Error updating GPA data on server:", response.data);
          Swal.fire({
            icon: "error",
            title: "Update Failed",
            text: "An error occurred on the server. Please check logs.",
          });
        }
      }
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
        {Array.from({ length: student.semester || 0 }, (_, i) => i + 1).map(
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
                placeholder="Enter GPA"
                defaultValue={
                  (gpa.find && gpa.find((g) => g.semester === sem)?.gpa) || ""
                }
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

