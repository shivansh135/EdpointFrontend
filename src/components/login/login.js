import React, { useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./login.css";
import { Link } from "react-router-dom";

export const Login = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showOtpField) {
      // Focus on the OTP input field when it's displayed
      document.getElementById("otpInput").focus();
    }
  }, [showOtpField]);

  async function requestOTP() {
    try {
      // Make API call to request OTP
      const response = await fetch(
        process.env.REACT_APP_API_CALLBACK + "/login/userOtp",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: inputUsername }),
        }
      );

      if (response.ok) {
        setShowOtpField(true); // Show OTP input field
      } else if (response.status === 400) {
        setErrorMessage("User not found.");
        setShow(true); // Show error alert
      } else {
        throw new Error("Failed to request OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setLoading(true);
    if (!showOtpField) {
      await requestOTP();
    } else {
      // Make API call for login with OTP
      try {
        const response = await fetch(
          process.env.REACT_APP_API_CALLBACK + "/login/userLogin",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: inputUsername, otp: otpInput }),
          }
        );

        if (response.status === 200) {
          window.location.href = "/";
        } else {
          setErrorMessage("Incorrect OTP.");
          setShow(true); // Show error alert
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div
      className="sign-in__wrapper"
      style={{ background: "#9290C3", maxWidth: "100%", maxHeight: "100%" }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded">
        {/* Header */}
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={"/edlogo.jpg"}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Log In</div>
        {/* Alert */}
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        {showOtpField && (
          <Form.Group className="mb-2" controlId="otpInput">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              type="text"
              value={otpInput}
              placeholder="Enter OTP"
              onChange={(e) => setOtpInput(e.target.value)}
              required
            />
          </Form.Group>
        )}
        {!loading ? (
          <Button
            className="w-100"
            variant="primary"
            type="button"
            onClick={handleLogin}
          >
            {!showOtpField ? "Request OTP" : "Log In"}
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="button" disabled>
            {!showOtpField ? "Requesting OTP..." : "Logging In..."}
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Link to="/register" className="text-muted px-0" variant="link">
            New Account? Sign In
          </Link>
        </div>
      </Form>
    </div>
  );
};

export const Register = () => {
  const [inputUsername, setInputUsername] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [standard, setStandard] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    // Validate form fields
    const formErrors = {};
    if (!inputUsername) formErrors.username = "Username is required";
    if (!name) formErrors.name = "Name is required";
    if (!phone) formErrors.phone = "Phone is required";
    if (!city) formErrors.city = "City is required";
    if (!standard) formErrors.standard = "Standard is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_API_CALLBACK + "/login/userSignIn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inputUsername,
            name,
            phone,
            city,
            standard,
          }),
        }
      );

      if (response.ok) {
        window.location.href = "/login";
      } else if (response.status === 409) {
        // Username conflict
        setErrors({ username: "Username already exists" });
        setShow(true);
      } else {
        throw new Error("Failed to register");
      }
    } catch (error) {
      console.error("Error:", error);
      setShow(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="sign-in__wrapper"
      style={{ background: "#9290C3", maxWidth: "100%", maxHeight: "100%" }}
    >
      <div className="sign-in__backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={"/edlogo.jpg"}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign Up</div>
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Failed to register. Please try again.
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Email"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
          {errors.username && (
            <Form.Text className="text-danger">{errors.username}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={phone}
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {errors.phone && (
            <Form.Text className="text-danger">{errors.phone}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={city}
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            required
          />
          {errors.city && (
            <Form.Text className="text-danger">{errors.city}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-2" controlId="standard">
          <Form.Label>Standard</Form.Label>
          <Form.Control
            type="text"
            value={standard}
            placeholder="Standard"
            onChange={(e) => setStandard(e.target.value)}
            required
          />
          {errors.standard && (
            <Form.Text className="text-danger">{errors.standard}</Form.Text>
          )}
        </Form.Group>
        <Button
          className="w-100"
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Sign Up"}
        </Button>
        <div className="d-grid justify-content-end">
          <Link to="/login" className="text-muted px-0" variant="link">
            Already have an account? Log In
          </Link>
        </div>
      </Form>
    </div>
  );
};

export const AdminLogin = () => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_CALLBACK + "/login/adminLogin",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: inputEmail, password: inputPassword }),
        }
      );

      if (response.ok) {
        // Reload the page upon successful login
        window.location.href = "/";
      } else {
        setShow(true); // Display error alert on failure
      }
    } catch (error) {
      console.error("Error:", error);
      setShow(true); // Display error alert on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ background: "#9290C3", maxWidth: "100%", maxHeight: "100%" }}
    >
      <div className="sign-in__backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleLogin}>
        <img
          className="img-thumbnail mx-auto d-block mb-2"
          src={"/edlogo.jpg"}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Admin Log In</div>
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect email or password.
          </Alert>
        )}
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={inputEmail}
            placeholder="Email"
            onChange={(e) => setInputEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        <div className="d-grid justify-content-end">
          <Link to="/register" className="text-muted px-0" variant="link">
            New Account?
          </Link>
        </div>
      </Form>
    </div>
  );
};
