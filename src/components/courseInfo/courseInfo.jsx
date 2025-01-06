import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CourseSubjects } from "./cource_assets";
import "./courseInfo.css";
import Loading from "../loading/loading";
function CourseInfo({ user }) {
  const { id } = useParams(); // Extract the course ID from the URL
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [buyClicked, setIsBuyClicked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the course data from your backend server

    try {
      setIsLoading(true);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }), // send the id in the body of the request
      };
      fetch(
        process.env.REACT_APP_API_CALLBACK + `/cources/courseInfo`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.image.data) {
            const base64 = btoa(
              new Uint8Array(data.image.data.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            data.image.data =
              "data:" + data.image.contentType + ";base64," + base64;
          }
          setCourse(data);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  }, [id]);

  const handleBuy = async () => {
    if (!user._id) {
      navigate("/login");
    }
    setIsBuyClicked(true);
    const userId = user._id; // Replace with your user ID
    const courseId = id; // Replace with your params
    try {
      const response = await fetch(
        process.env.REACT_APP_API_CALLBACK + "/payment/pay",
        {
          // Replace with your route
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, courseId, amount: course.price }), // Replace with your payload}),
        }
      );
      const data = await response.json();

      if (data.success && data.paymentUrl) {
        // Redirect to the payment URL
        window.location.href = data.paymentUrl;
      } else {
        // Handle failure
        console.error(
          "Payment initiation failed:",
          data.message || "Unknown error"
        );
        alert(data.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : user.courses?.includes(id) ? (
        <>
          <CourseSubjects subjects={course.subjects} courseName={course.name} />
        </>
      ) : (
        <>
          <div className="contCard">
            <img src={course.image.data} alt="sample"></img>
            <div className="text-wrap">
              <h4>{course.name}</h4>
              <div className="text">{course.description}</div>
              <div className="pricing">
                {course.discount ? (
                  <>
                    <span
                      className="original-price"
                      style={{
                        textDecoration: "line-through",
                        color: "#aaa",
                        marginRight: "10px",
                      }}
                    >
                      ₹ {course.price}
                    </span>
                    <span
                      className="current-price"
                      style={{
                        filter: course.discount ? "blur(0.2px)" : "none",
                      }}
                    >
                      ₹ {course.price - course.discount}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="original-price">₹ {course.price}</span>
                  </>
                )}
              </div>

              {user.requests?.includes(id) ? (
                <button type="button" class="btn btn-warning" disabled>
                  Request Pending...
                </button>
              ) : buyClicked ? (
                <button
                  type="button"
                  class="btn btn-warning"
                  onClick={handleBuy}
                >
                  Request Pending...
                </button>
              ) : (
                <Link
                  to="/checkout"
                  state={course}
                  type="button"
                  class="btn btn-info"
                  onClick={handleBuy}
                >
                  Buy
                </Link>
              )}
            </div>
          </div>
          <Container style={{ marginTop: "40px" }}>
            <h4 style={{ fontSize: "35px", color: "white" }}>Subjects</h4>
            <Row style={{ gap: "1px" }}>
              {course.subjects
                ?.filter((element) => element !== null)
                .map((element) =>
                  element ? (
                    <div
                      key={element._id}
                      style={{ maxWidth: "fit-content", margin: "5px" }}
                    >
                      <div
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          border: "1px solid #4891D8", // This is the border color for 'btn-info'
                          borderRadius: "0.25rem", // This matches the border-radius for Bootstrap buttons
                          color: "#fff",
                          backgroundColor: "#4891D8",
                          textAlign: "center",
                          fontSize: "18px", // This makes the title text larger
                          cursor: "pointer",
                          textTransform: "capitalize",
                        }}
                      >
                        {element.title}
                      </div>
                    </div>
                  ) : null
                )}
            </Row>
            <div style={{ marginTop: "15px" }}>
              <h4 style={{ fontSize: "28px", color: "white" }}>Key Features</h4>
              <ul style={{ fontSize: "22px" }}>
                {course.notes &&
                  course.notes.split(",").map((note, index) => (
                    <li key={index} style={{ color: "white" }}>
                      {note.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          </Container>
        </>
      )}
    </div>
  );
}

export default CourseInfo;
