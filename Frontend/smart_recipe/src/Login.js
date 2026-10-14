import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // Import your CSS file

export default function Login() {
  const [usertype, setUsertype] = useState("User");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false); // Track submission
  const navigate = useNavigate();

  // Handle normal login
  function handleLogin(e) {
    e.preventDefault();
    setFormSubmitted(true);

    if (password.length !== 8) {
      toast.error("Password must be exactly 8 characters long.");
      return; // Stop submission if password validation fails
    }

    const data = { usertype, email, password };

    axios
      .post("http://localhost:8080/user/login", data)
      .then((res) => {
        console.log("Response Data:", res);
        if (res.status === 200) {
          sessionStorage.setItem("email", email); // Store the email instead of userid
          toast.success("Login Successful!");

          // Navigate based on usertype
          if (res.data === "Admin") {
            navigate("/adminDashboard");
          } else if (res.data === "User") {
            navigate("/userDashboard");
          }
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        toast.error("Login failed. Check your credentials.");
      });
  }

  function handleRegister(event) {
    event.preventDefault();
    setFormSubmitted(true);

    if (password.length !== 8) {
      toast.error("Password must be exactly 8 characters long.");
      return; // Stop submission if password validation fails
    }

    const requestBody = { usertype, email, name, password };

    axios
      .post("http://localhost:8080/registerUser", requestBody)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Registration Successful!");
          setIsRegistering(false); // Switch back to login view after successful registration
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
        toast.error(err.response?.data || "Registration failed");
      });
  }

  return (
    <div className="background-container">
      <ToastContainer /> {/* Add ToastContainer to render notifications */}
      <div className="containerr mt-1">
        <div className="carddd">
          <h2 className="text-center">
            {isRegistering ? "Register" : "Login"}
          </h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <div className="form-group mb-1">
              <label htmlFor="usertype">User Type:</label>
              <select
                className="form-control"
                id="usertype"
                value={usertype}
                onChange={(e) => setUsertype(e.target.value)}
                disabled={isRegistering && usertype === "Admin"}
              >
                <option value="User">User</option>
                {!isRegistering && <option value="Admin">Admin</option>}
              </select>
            </div>

            {isRegistering && (
              <div className="form-group mb-3">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group mb-3">
              <label htmlFor="email">Email ID:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isRegistering || (isRegistering && usertype === "User") ? (
              <div className="form-group mb-3">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  maxLength={8}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* Password Validation Message */}
                {formSubmitted && password.length !== 8 && (
                  <small className="text-danger">
                    Password must be exactly 8 characters long.
                  </small>
                )}
              </div>
            ) : null}

            <button type="submit" className="btn btn-primary w-100">
              {isRegistering ? "Register" : "Login"}
            </button>
          </form>

          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setFormSubmitted(false); // Reset validation on toggle
            }}
            className="btn btn-link d-block mx-auto mt-2"
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}








 // async function handleLogin(e) {
  //   e.preventDefault();
  //   setFormSubmitted(true);

  //   if (password.length !== 8) {
  //     return; // Stop submission if password validation fails
  //   }

  //   const data = { usertype, email, password };

  //   try {
  //     const res = await axios.post("http://localhost:8080/user/login", data);
  //     if (res.status === 200) {
  //       sessionStorage.setItem("email", email); // Store the email instead of userid
  //       // Navigate based on usertype
  //       if (usertype === "Admin") {
  //         navigate("/adminDashboard");
  //       } else if (usertype === "User") {
  //         navigate("/userDashboard");
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     alert("Login failed. Check your credentials ");
  //   }
  // }










 // async function handleRegister(event) {
  //   event.preventDefault();
  //   setFormSubmitted(true);

  //   if (password.length !== 8) {
  //     return; // Stop submission if password validation fails
  //   }

  //   const requestBody = { usertype, email, password };

  //   try {
  //     const res = await axios.post("http://localhost:8080/registerUser", requestBody);
  //     if (res.status === 200) {
  //       alert("Registration Successful");
  //       setIsRegistering(false); // Switch back to login view after successful registration
  //     }
  //   } catch (err) {
  //     console.error("Registration error:", err);
  //     alert(err.response?.data || "Registration failed");
  //   }
  // }