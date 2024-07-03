import React, { useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  InputGroup,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../../css/Login.css";
import logo from "../../Assets/Logonn.png";


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      // navigate("/dashboard");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Ooops...",
        text: "Data connection error. Please try again.",
      }).then(() => {
        navigate("/login");
      });
      setLoading(false);
    }
  }

  return (
    <div className="login-background">

      <Container className="d-flex align-items-center justify-content-center login-background-container" style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "100%" }}>

          <Card>
            <Card.Body>
            < div className="d-flex align-items-center mb-4">
                <img src={logo} alt="Budget Buddy Logo" className="img-black me-2 w-2vw" />
                <h3 className="text-left mb-0">Budget Buddy</h3>
              </div>
              <h1 className="text-left mb-4">Login</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group id="password" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      ref={passwordRef}
                      required
                      className="no-border-radius-right"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="no-border-radius-left"
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                      />
                    </Button>
                  </InputGroup>
                  <div className="mt-3 d-flex justify-content-between mb-4">
                    <Form.Check type="checkbox" label="Remember Me" />
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3 submit-btn-login" type="submit">
                  Log In
                </Button>
              </Form>
            </Card.Body>
          <div className="w-100 text-center mt-2 pb-5">
            Need an account? <Link to="/signup">Register</Link>
          </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
