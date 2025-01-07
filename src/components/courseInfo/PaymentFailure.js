import React from "react";
import { Link } from "react-router-dom";

const PaymentFailure = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "290px" }}>
      <h1 style={{ color: "red" }}>Payment Failed</h1>
      <p>Something went wrong during the payment process. Please try again.</p>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button className="btn btn-danger" style={{ marginTop: "90px" }}>
          Go to Homepage
        </button>
      </Link>
    </div>
  );
};

export default PaymentFailure;
