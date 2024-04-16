import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import LineChart from "./LineChart";

export default function Statistics() {
  const { sid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [savedGpa, setSavedGpa] = useState([]);

  useEffect(() => {
    const fetchStudentAndGpa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/student/get/${sid}`
        );
        setStudent(response.data.user);
        setSavedGpa(response.data.user.gpa || []);
        setIsLoading(false);
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

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6">
          {student && savedGpa.length > 0 ? (
            <div className="mt-5">
              <h2>GPA Statistics for {student.name}</h2>
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
          ) : (
            <h2>No GPA data available</h2>
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
        <div className="col-md-6">
          {/* Render LineChart component with GPA data */}
          {student && savedGpa.length > 0 && (
            <LineChart gpaData={savedGpa} />
          )}
        </div>
      </div>
    </div>
  );
}
