import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkout.css";

const Checkout = () => {
  const [customerName, setCustomerName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const course = location.state || {
    name: "React Fundamentals",
    details: "A comprehensive guide to learning React.js from scratch.",
    endDate: "2024-09-24T00:00:00.000Z",
    price: 200,
    discount: 0,
  };

  const finalPrice = course.price - course.discount;

  const handleNameChange = (e) => {
    setCustomerName(e.target.value);
  };

  const handleProceed = async () => {
    if (!customerName) {
      alert("Please enter your name before proceeding.");
      return;
    }

    try {
      setLoading(true);

      const orderId = `ORD_${Date.now()}`; // Generate unique order ID
      const payload = {
        orderId: orderId, // Replace with actual order ID, can be dynamic or retrieved from API
        amount: "100", // Replace with actual final price, can be dynamic or calculated
        userId: "67759ebb2e7185311c4f41f5", // Replace with actual user ID (retrieved from user session, API, or context)
        courseId: "676c0aa6148e8c4720031cb3", // Replace with actual course ID (retrieved from the course details or context)
      };

      // Initiate payment
      const response = await axios.post(
        `  ${process.env.REACT_APP_API_CALLBACK}/payment/initiate`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (
        response.status === 200 &&
        response.data.data &&
        response.data.data.redirectUrl
      ) {
        const { redirectUrl } = response.data.data;

        // Redirect to PhonePe payment page
        window.location.href = redirectUrl;
      } else {
        throw new Error("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert(
        "An error occurred while initiating the payment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/payment/verify`,
        { orderId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setPaymentStatus("Payment successful!");
      } else {
        setPaymentStatus("Payment verification failed.");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setPaymentStatus("An error occurred while verifying payment.");
    }
  };

  useEffect(() => {
    // Check for orderId in URL parameters (callback from PhonePe)
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    if (orderId) {
      verifyPayment(orderId);
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="customer-name">
        <label htmlFor="customerName">Customer Name:</label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={handleNameChange}
        />
      </div>
      <div className="course-item">
        <h2 style={{ color: "#2a2a2a" }}>{course.name}</h2>
        <p>{course.details}</p>
        <p>Valid till: {formatDate(course.endDate)}</p>
        <p>Price: Rs. {course.price}</p>
        <p>Discount: Rs. {course.discount}</p>
      </div>
      <div className="total">
        <h2 style={{ color: "#2a2a2a" }}>Total: Rs. {finalPrice}</h2>
      </div>
      <button onClick={handleProceed} disabled={loading}>
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>

      {paymentStatus && <div className="payment-status">{paymentStatus}</div>}
    </div>
  );
};

export default Checkout;
