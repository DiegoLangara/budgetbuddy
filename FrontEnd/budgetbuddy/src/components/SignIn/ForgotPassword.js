import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import "../../css/ForgotPassword.css";
import logo from "../../Assets/Logonn.png";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <div className="forgot-password-background">
      <Container className="d-flex justify-content-end align-items-center forgot-password-background-container" style={{ minHeight: "100vh" }}>
        <div className="Card-cont">
          <Card>
            <Card.Body>
              <div className="d-flex mb-4">
                <img src={logo} alt="Budget Buddy Logo" className="img-black me-2 w-2vw" />
                <h3 className="text-left mb-0">Budget Buddy</h3>
              </div>
              <h2 className="text-center mb-4">Password Reset</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group id="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" ref={emailRef} required />
                </Form.Group>
                <Button disabled={loading} className="w-100 mt-3 submit-btn-forgot" type="submit">
                  Reset Password
                </Button>
              </Form>
              <div className="w-100 text-center mt-3">
                <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}
