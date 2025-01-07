import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const PaymentSuccess = () => {
  const { orderId } = useParams(); // Extract orderId from the URL params
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // Make a GET request to fetch the order details using the orderId
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/payment/payment-success/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }

        const data = await response.json();

        // Check payment status and set the message
        if (data.paymentDetails.status === "SUCCESS") {
          setMessage(
            `Payment was successful. Transaction ID: ${data.paymentDetails.transactionId}`
          );
        } else {
          setMessage("Payment failed. Please contact support.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setMessage("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div style={{ textAlign: "center", marginTop: "290px" }}>
      {loading ? (
        <h2 style={{ color: "blue" }}>Fetching Payment Details...</h2>
      ) : (
        <>
          <h1
            style={{
              color: message.startsWith("Payment was successful")
                ? "green"
                : "red",
            }}
          >
            {message.startsWith("Payment was successful")
              ? "Payment Successful!"
              : "Payment Failed!"}
          </h1>
          <p>{message}</p>
        </>
      )}

      <Link to="/" style={{ textDecoration: "none" }}>
        <button className="btn btn-primary" style={{ marginTop: "90px" }}>
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
