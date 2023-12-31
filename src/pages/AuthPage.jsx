import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const url = "https://48-restful-expressjs-pgsql-login-api.vercel.app";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${url}/signup`, { username, password });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row className="gx-0">
      <Col sm={6}>
        <Image alt="Twitter banner" fluid src={loginImage} />
      </Col>
      <Col sm={6} className="p-4">
        <i className="bi bi-twitter" style={{ fontSize: 50, color: "dodgerblue" }}></i>

        <p className="mt-5" style={{ fontSize: 64 }}>Happening Now</p>
        <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter Today.</h2>

        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-google"></i> Sign up with Google
          </Button>
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-apple"></i> Sign up with Apple
          </Button>
          <p className="text-center">or</p>
          <Button className="rounded-pill" onClick={handleOpen}>
            Create an account
          </Button>
          <p style={{ fontSize: 12 }}>
            By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use.
          </p>

          <p className="mt-5 fw-bold">
            Already have an account?
          </p>
          <Button className="rounded-pill" variant="outline-primary">Sign In</Button>
        </Col>
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Body>
            <h2 className="mb-4 fw-bold">
              Create your account
            </h2>
            <Form className="d-grid gap-2 px-5" onSubmit={handleSignUp}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter email"
                  type="email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                />
              </Form.Group>
              <p style={{ fontSize: 12 }}>
                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                Luna Tweets may use your contact information, including your email address and phone number
                for purposes outlined in our Privacy Policy, like keeping you account secure and personalising
                our services, including ads. Learn more. Others will be able to find you by email or phone
                number, when provided, unless you choose otherwise here.
              </p>

              <Button className="rounded-pill" type="submit">
                Sign Up
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
