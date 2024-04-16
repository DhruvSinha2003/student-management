import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function GPA() {
  const { sid } = useParams();
  const [student, setStudent] = useState({});
  const [gpa, setGpa] = useState([]);
  const [savedGpa, setSavedGpa] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchStudentAndGpa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/student/get/${sid}`
        );
        setStudent(response.data.user);
        setGpa(response.data.user.gpa || []);
        setIsLoading(false); // Update loading state when data is fetched
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

  const saveGpa = () => {
    try {
      const gpaValues = Array.from(
        { length: student.semestersCleared || 0 },
        (_, i) => {
          const gpaInput = document.getElementById(`gpa-${i + 1}`);
          return parseFloat(gpaInput.value) || 0;
        }
      );

      setSavedGpa(gpaValues);
      Swal.fire("GPA updated successfully!", "", "success");
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
        {Array.from(
          { length: student.semestersCleared || 0 },
          (_, i) => i + 1
        ).map((sem) => (
          <div key={sem} className="mb-3">
            <label htmlFor={`gpa-${sem}`} className="form-label">
              GPA for Semester {sem}
            </label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id={`gpa-${sem}`}
              placeholder={gpa && gpa[sem - 1] ? gpa[sem - 1] : "Enter GPA"}
            />
          </div>
        ))}
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

      {/* Display table if GPA data is saved */}
      {savedGpa.length > 0 && (
        <div className="mt-5">
          <h3>Saved GPA Data</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Semester</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {savedGpa.map((gpa, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{gpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display loading spinner while fetching data */}
      {isLoading && (
        <div className="mt-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}
