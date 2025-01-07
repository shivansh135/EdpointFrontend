import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData?._id;

        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_CALLBACK}/cources/assignCourse`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setCourses(data.courses || []); // Default to an empty array if no courses
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "230px" }}>
      <h1 style={{ color: "blue" }}>My Courses</h1>

      {loading ? (
        <p style={{ marginTop: "40px", fontSize: "18px", color: "gray" }}>
          Loading your courses...
        </p>
      ) : error ? (
        <p style={{ marginTop: "40px", fontSize: "18px", color: "red" }}>
          {error}
        </p>
      ) : courses && courses.length > 0 ? (
        <div style={{ marginTop: "40px" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              justifyItems: "center",
            }}
          >
            {courses.map((course, index) => (
              <li
                key={index}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  width: "90%",
                  maxWidth: "300px",
                  textAlign: "center",
                }}
              >
                <Link
                  to={`/courses/${course._id}`} // Link to course details page
                  style={{
                    textDecoration: "none",
                    color: "darkslategray",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  {course.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: "40px", fontSize: "18px", color: "gray" }}>
          You have not enrolled in any courses yet.
        </p>
      )}

      <Link to="/" style={{ textDecoration: "none" }}>
        <button
          className="btn btn-primary"
          style={{ marginTop: "50px", padding: "10px 20px" }}
        >
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default MyCourses;
