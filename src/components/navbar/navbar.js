import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

function NavScrollExample({ user }) {
  return (
    <Navbar
      expand="lg"
      data-bs-theme="dark"
      style={{
        position: "sticky",
        top: "0px",
        zIndex: "99999",
        backgroundColor: "#0A1128",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Container fluid>
        <Navbar.Brand
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          <img
            src={"/edlogo.jpg"}
            alt="logo"
            className="logo-hover"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              transition: "transform 0.3s ease",
            }}
          />
          <span
            style={{
              border: "2px solid #D1D5DB",
              borderRadius: "10px",
              padding: "3px 10px",
              fontSize: "1rem",
              color: "#FFFFFF",
              transition: "all 0.3s ease",
            }}
            className="brand-hover"
          >
            EDUCATION POINT
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/" className="nav-link-custom">
              Home
            </Nav.Link>
            <Nav.Link href="/#offline" className="nav-link-custom">
              Courses
            </Nav.Link>
            <Nav.Link href="/#teachers" className="nav-link-custom">
              Teachers
            </Nav.Link>
            <Nav.Link href="/gallery" className="nav-link-custom">
              Gallery
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            {user?.name ? (
              <NavDropdown
                title={user.name}
                id="userDropdown"
                align="end"
                menuVariant="dark"
                style={{
                  fontWeight: "bold",
                  color: "#D1D5DB",
                  border: "2px solid #D1D5DB",
                  backgroundColor: "transparent",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <NavDropdown.Item href="/mycourses">
                  My Courses
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={async () => {
                    const response = await fetch(
                      process.env.REACT_APP_API_CALLBACK + "/login/logout",
                      { method: "POST", credentials: "include" }
                    );
                    if (response.status === 200) {
                      window.location.href = "/";
                    }
                  }}
                >
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <a href="/login">
                <Button
                  style={{
                    fontWeight: "bold",
                    border: "2px solid #D1D5DB",
                    color: "#D1D5DB",
                    backgroundColor: "transparent",
                    padding: "10px 20px",
                    transition: "all 0.3s ease",
                  }}
                  className="login-button"
                >
                  Log In / Sign Up
                </Button>
              </a>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
      <style>
        {`
          /* Navbar Styles */
          .nav-link-custom {
            color: #D1D5DB !important;
            font-weight: 500;
            font-size: 1rem;
            padding: 10px 15px;
            border-radius: 5px;
            transition: all 0.3s ease;
          }
          .nav-link-custom:hover {
            background: #E0F7FA; /* Very light sky blue */
            color: #005662 !important; /* Darker teal for text */
            transform: scale(1.05);
          }

          /* Username Hover Effect */
          .username-hover:hover {
            background: #E0F7FA; /* Very light sky blue */
            color: #005662 !important; /* Dark teal text */
            border-color: #81d4fa !important; /* Soft blue border */
            transform: scale(1.05);
          }

          /* User Dropdown Hover Effect */
          #userDropdown .dropdown-item:hover {
            background: #E0F7FA !important;
            color: #005662 !important;
          }

          /* User Button and Login Button Hover Effect */
          .login-button:hover {
            background: #E0F7FA; /* Very light sky blue */
            color: #005662 !important; /* Dark teal text */
            border-color: #81d4fa !important; /* Soft blue border */
          }

          /* Dropdown Menu */
          .dropdown-menu-dark {
            background-color: #2D3748 !important;
            color: #FFFFFF !important;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          .dropdown-menu-dark a {
            color: #FFFFFF !important;
            padding: 10px 15px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
          }
          .dropdown-menu-dark a:hover {
            background: #E0F7FA; /* Very light sky blue */
            color: #005662 !important;
          }

          /* Divider Styling */
          .dropdown-menu-dark .dropdown-divider {
            border-top: 1px solid #4A5568 !important;
          }

          /* Navbar Brand Hover */
          .brand-hover:hover {
            background: #E0F7FA !important; /* Same hover color as other elements */
            color: #005662 !important;
            border-color: #81d4fa !important; /* Match hover border */
          }

          /* Logo Zoom on Hover */
          .logo-hover:hover {
            transform: scale(1.2); /* Slightly increase size */
          }
        `}
      </style>
    </Navbar>
  );
}

export default NavScrollExample;
