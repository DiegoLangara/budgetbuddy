import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, InputGroup, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import "../../css/Signup.css";
import logo from "../../Assets/Logonn.png";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    if (!validatePassword(passwordRef.current.value)) {
      return setError("Password must be at least 8 characters long and contain at least one letter and one number");
    }

    try {
      setError("");
      setLoading(true);
      const data = await signup(emailRef.current.value, passwordRef.current.value);
      Swal.fire({
        icon: data.message_icon,
        title: data.message_title,
        text: data.message_text,
      }).then(() => {
        if (data.success) {
          navigate("/login");
        } else {
          setLoading(false);
        }
      });
    } catch {
      setError("Failed to create an account");
      setLoading(false);
    }
  }

  return (
    <div className="signup-background">
      <Container className="d-flex align-items-center justify-content-center signup-background-container" style={{ minHeight: "100vh" }}>
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <img src={logo} alt="Budget Buddy Logo" className="img-black me-2 w-2vw" />
                <h3 className="text-left mb-0">Budget Buddy</h3>
              </div>
              <h1 className="text-left mb-4">Register</h1>
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
                      <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group id="password-confirm" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPasswordConfirm ? "text" : "password"}
                      ref={passwordConfirmRef}
                      required
                      className="no-border-radius-right"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="no-border-radius-left"
                    >
                      <FontAwesomeIcon icon={showPasswordConfirm ? faEye : faEyeSlash} />
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group id="terms" className="mb-3">
                  <Form.Check type="checkbox" label="Accept terms and conditions" required />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3 submit-btn-signup" type="submit">
                  Register
                </Button>
              </Form>
            </Card.Body>
            <div className="w-100 text-center mt-2 pb-4">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
