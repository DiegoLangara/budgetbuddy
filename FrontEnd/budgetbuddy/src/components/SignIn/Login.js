import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const rememberMeRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value, rememberMeRef.current.checked)
      navigate("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
      <h2 className="text-center mb-4">Budget Buddy</h2>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="remember-me" className="mt-3">
              <Form.Check type="checkbox" label="Remember Me" ref={rememberMeRef} />
            </Form.Group>
            <Button disabled={loading} className="w-100 mt-3" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
      <div className="w-100 text-center mt-2">
        {"    "}
        <Link to=""><i className="bi bi-facebook"></i></Link>
        {"    "}
        <Link to=""><i className="bi bi-google"></i></Link>
        {"    "}
        <Link to=""><i className="bi bi-apple"></i></Link>
      </div>

      <div className="w-100 text-center mt-2">
          <Link to="/terms">Terms & Conditions</Link>
      </div>
    </>
  )
}
