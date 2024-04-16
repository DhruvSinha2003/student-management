import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3, BsGraphUp } from "react-icons/bs";
import NoStudent from "../../Components/NoStudent";
import { ClipboardData } from "react-bootstrap-icons";
import { MdOutlineAnalytics } from "react-icons/md";

export default function Home() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await axios.get("http://localhost:8070/student/get");
        setStudents(res.data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      }
    };
    getStudents();
  }, []);

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8070/student/delete/${id}`)
          .then((res) => {
            Swal.fire("Deleted!", res.data.status, "success");
            const updatedStudents = students.filter(
              (student) => student._id !== id
            );
            setStudents(updatedStudents);
          })
          .catch((err) => {
            Swal.fire("Not Deleted!", err.message, "error");
          });
      }
    });
  };

  return (
    <div className="text-center mb-4">
      <h2 className="mb-4" style={{ padding: "1rem" }}>
        Students
      </h2>
      <Link to="/add-student" style={{ textDecoration: "none" }}>
        <button className="btn btn-primary mb-4" type="submit">
          Add Student
        </button>
      </Link>
      <div className="container">
        {students.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>Sr. No</th>
                <th>Name</th>
                <th>Number</th>
                <th>Gender</th>
                <th>Semesters Cleared</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.nim}</td>
                  <td>{item.gender}</td>
                  <td>{item.semestersCleared}</td>
                  <td>
                    <Link
                      to={`/get/${item._id}`}
                      className="btn btn-primary mr-2"
                      style={{ marginRight: "5px" }}
                      title="Edit"
                    >
                      <FaRegEdit />
                    </Link>
                    <Link
                      to={`/student/gpa/${item._id}`}
                      className="btn btn-success mr-2"
                      style={{ backgroundColor: "orange", marginRight: "5px" }}
                      title="Add GPA"
                    >
                      <ClipboardData style={{ color: "white" }} />
                    </Link>
                    <Link
                      to={`/student/statistics/${item._id}`}
                      className="btn btn-success mr-2"
                      style={{ marginRight: "5px" }}
                      title="Statistics"
                    >
                      <BsGraphUp />
                    </Link>
                    <Link
                      to={`/student/analysis/${item._id}`}
                      className="btn mr-2"
                      style={{
                        backgroundColor: "purple",
                        color: "white",
                        marginRight: "5px",
                        display: "inline-block",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 14px",
                        textDecoration: "none",
                      }}
                      title="Analysis"
                    >
                      <MdOutlineAnalytics />
                    </Link>

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteUser(item._id)}
                      title="Delete"
                    >
                      <BsTrash3 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoStudent />
        )}
      </div>
    </div>
  );
}
