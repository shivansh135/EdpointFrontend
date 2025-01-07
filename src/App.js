import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Home } from "./components/home/home";
import NavScrollExample from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { Login, AdminLogin, Register } from "./components/login/login";
import "./App.css";
import { Admin } from "./components/admin/admin";
import AdminNavScrollExample from "./components/admin/navbar/navbar";
import { AdminCourse } from "./components/admin/course/course";
import { Subject } from "./components/admin/course/subject";
import { Notes, Videos } from "./components/admin/course/videos";
import { useEffect, useState } from "react";
import Loading from "./components/loading/loading";
import { AdminPage } from "./components/admin/adminPage/adminPage";
import { StudentPage } from "./components/admin/studentPage/studentPage";
import CourseInfo from "./components/courseInfo/courseInfo";
import BuyRequest from "./components/admin/BuyRequestPage/BuyRequest";
import {
  Chapters,
  CourseSubjects,
  VideoNotes,
} from "./components/courseInfo/cource_assets";
import WatchVideo from "./components/courseInfo/WatchVideo";
import ReadNote from "./components/courseInfo/ReadNote";
import {
  AboutUsComponent,
  ContactUsComponent,
  PrivacyPolicyComponent,
  RefundPolicyComponent,
  TermsAndConditionsComponent,
} from "./components/footer/info";
import Gallery from "./components/Gallery/Gallery";
import Checkout from "./components/checkout/checkout";
import PaymentSuccess from "./components/courseInfo/PaymentSuccess";
import PaymentFailure from "./components/courseInfo/PaymentFailure";
import MyCources from "./components/courseInfo/myCources";
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  const [role, setRole] = useState(null); // User role: 'user' or 'admin'
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_CALLBACK + "/login/verify",
          { method: "POST", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          setRole(data.role); // Assuming the response contains the user's role
          setUser(data.user);

          // Save the data to local storage
          localStorage.setItem("userRole", data.role); // Save role
          localStorage.setItem("userData", JSON.stringify(data.user)); // Save user data as a JSON string

          console.log(data.user);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyLogin();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (role === "admin") {
    return (
      <Router>
        <AdminNavScrollExample />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/adminCourse/:id" element={<AdminCourse />} />
          <Route path="/adminSubject" element={<Subject />} />
          <Route path="/adminVideos" element={<Videos />} />
          <Route path="/adminNotes" element={<Notes />} />
          <Route path="/admins" element={<AdminPage />} />
          <Route path="/buyRequests" element={<BuyRequest />} />
          <Route path="/students" element={<StudentPage />} />

          <Route
            path="*"
            element={
              <h1
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                404
                <br /> Page Not Found
              </h1>
            }
          />
        </Routes>
        <Footer />
      </Router>
    );
  } else {
    return (
      <Router>
        <NavScrollExample user={user} />
        <ScrollToTop />
        <div class="area">
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<CourseInfo user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/text" element={<VideoNotes />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/startCourse" element={<VideoNotes />} />
          <Route path="/watchvideo" element={<WatchVideo />} />
          <Route path="/readNote" element={<ReadNote />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<AboutUsComponent />} />
          <Route path="/tandc" element={<TermsAndConditionsComponent />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyComponent />} />
          <Route path="/refund-policy" element={<RefundPolicyComponent />} />
          <Route path="/contact" element={<ContactUsComponent />} />
          <Route path="/checkout" element={<Checkout />} />

          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/mycourses" element={<MyCources />} />
          <Route
            path="*"
            element={
              <h1
                style={{
                  minHeight: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                404
                <br /> Page Not Found
              </h1>
            }
          />
          <Route
            path="/payment/payment-success/:orderID"
            element={<PaymentSuccess />}
          />
        </Routes>

        <Footer />
      </Router>
    );
  }
}

export default App;
