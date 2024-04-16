import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

export default function Analysis() {
  const { sid } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [goalGpa, setGoalGpa] = useState("");
  const [requiredScores, setRequiredScores] = useState([]);
  const [aggregateGpa, setAggregateGpa] = useState(null);

  useEffect(() => {
    const fetchStudentAndGpa = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/student/get/${sid}`
        );
        const { user, aggregateGpa } = response.data;
        setStudent(user);
        setAggregateGpa(aggregateGpa);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching student data:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      }
    };
    fetchStudentAndGpa();
  }, [sid]);

  // Generate goal GPA options (6-10)
  const goalGpaOptions = Array.from({ length: 5 }, (_, i) => (i + 6).toFixed(2));

  // Calculate aggregate GPA when GPA data is available
  useEffect(() => {
    if (student && student.gpa && student.gpa.length > 0) {
      const currentTotal = student.gpa.reduce((acc, curr) => acc + curr, 0);
      const aggregate = currentTotal / student.semestersCleared;
      setAggregateGpa(aggregate.toFixed(2));
    }
  }, [student]);

  // Calculate required scores when goal GPA changes
  useEffect(() => {
    if (goalGpa && student && student.gpa && student.gpa.length > 0) {
      const currentSemester = student.gpa.length;
      const remainingSemesters = 8 - currentSemester;
      const currentTotal = student.gpa.reduce((acc, curr) => acc + curr, 0);
      const goalTotal = parseFloat(goalGpa) * 8;
      const remainingTotal = goalTotal - currentTotal;
      const requiredPerSemester = remainingTotal / remainingSemesters;
      setRequiredScores(Array(remainingSemesters).fill(requiredPerSemester.toFixed(2)));
    }
  }, [goalGpa, student]);

  const handleGoalGpaChange = (e) => {
    setGoalGpa(e.target.value);
  };

  return (
    <div className="container p-5">
      <h2 className="mb-4">Analysis for {student ? student.name : ""}</h2>
      {student && student.gpa && student.gpa.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-12">
            <h3>Current GPA</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>GPA</th>
                </tr>
              </thead>
              <tbody>
                {student.gpa.map((gpa, index) => (
                  <tr key={index} className={index % 2 === 0 ? "table-light" : ""}>
                    <td>{index + 1}</td>
                    <td>{gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {aggregateGpa !== null && (
              <div className="bg-light p-3 mb-4">
                <h4>Aggregate GPA</h4>
                <h5>{aggregateGpa}</h5>
              </div>
            )}
          </div>
        </div>
      )}
      {student && student.gpa && student.gpa.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6">
            <h3>Select Goal GPA:</h3>
            <select className="form-select" value={goalGpa} onChange={handleGoalGpaChange}>
              <option value="">Select GPA</option>
              {goalGpaOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {requiredScores.length > 0 && (
            <div className="col-md-6">
              <h3>Required Scores for Goal GPA</h3>
              <ul className="list-group">
                {requiredScores.map((score, index) => (
                  <li key={index} className="list-group-item">{`Semester ${student.gpa.length + index + 1}: ${score}`}</li>
                ))}
              </ul>
            </div>
          )}
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
