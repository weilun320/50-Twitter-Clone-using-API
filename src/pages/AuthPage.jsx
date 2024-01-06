import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const url = "https://48-restful-expressjs-pgsql-login-api.vercel.app";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();

  // Possible values: null (no modal shows), "Login", "SignUp"
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");

  useEffect(() => {
    if (authToken) {
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Clear any error message
    setResponseMessage("");
    // Set button to loading stage to prevent user clicking when signup being processed
    setIsLoading(true);

    // Ensure user fill up all field
    if (!username || !password) {
      setResponseMessage("Please fill up all field.");
      setIsLoading(false);

      return;
    }

    // Regex for email
    const usernameRe = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

    if (!usernameRe.test(username)) {
      setResponseMessage("Invalid email");
      setIsLoading(false);

      return;
    }

    // Regex for password
    const passwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[1-9])(?=.*[?.*!@#$%^&,(){}\-_+=<>/|`~\\:;]).{8,32}$/;

    if (!passwordRe.test(password)) {
      setResponseMessage(`
        Password needs at least 8 characters length
        Password needs at least 1 uppercase letter (A...Z)
        Password needs at least 1 lowercase letter (a...z)
        Password needs at least 1 number (0...9)
        Password needs at least 1 special symbol (!...$)`);
      setIsLoading(false);

      return;
    }

    try {
      const res = await axios.post(`${url}/signup`, { username, password });
      console.log(res.data);

      setIsLoading(false);
      // Close signup modal and show login modal
      handleClose();
      setTimeout(() => {
        handleShowLogin();
      }, 100);
    } catch (error) {
      console.error(error);
      // Set error message from API
      if (error.response && error.response.status === 400) {
        setResponseMessage(error.response.data.message);
        setIsLoading(false);
      }
      else if (error.response && error.response.status === 500) {
        setResponseMessage(error.response.data.error);
        setIsLoading(false);
      }
      else {
        setResponseMessage(error.message);
        setIsLoading(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Clear any error message
    setResponseMessage("");
    // Set button to loading stage to prevent user clicking when signup being processed
    setIsLoading(true);

    // Ensure user fill up all field
    if (!username || !password) {
      setResponseMessage("Please fill up all field.");
      setIsLoading(false);

      return;
    }

    try {
      const res = await axios.post(`${url}/login`, { username, password });

      if (res.data && res.data.auth === true && res.data.token) {
        setAuthToken(res.data.token); // Save token to localStorage
        console.log("Login was successful, token saved");
      }
    } catch (error) {
      console.error(error);
      // Set error message from API
      if (error.response && error.response.status === 400) {
        setResponseMessage("Username or password incorrect");
        setIsLoading(false);
      }
      else if (error.response && error.response.status === 500) {
        setResponseMessage(error.response.data.error);
        setIsLoading(false);
      }
      else {
        setResponseMessage(error.message);
        setIsLoading(false);
      }
    }
  };

  // Reset all states when closing modal
  const handleClose = () => {
    setUsername("");
    setPassword("");
    setResponseMessage("");
    setIsLoading(false);
    setModalShow(null);
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
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{ fontSize: 12 }}>
            By signing up, you agree to the Terms of Service and Privacy Policy including Cookie Use.
          </p>

          <p className="mt-5 fw-bold">
            Already have an account?
          </p>
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign In
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4 fw-bold">
              {modalShow === "SignUp"
                ? "Create your account"
                : "Log in to your account"}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
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
              {responseMessage &&
                <div className="text-danger mb-3">
                  {responseMessage.indexOf("\n") !== -1
                    ? <ul className="mb-0" style={{ paddingInlineStart: 20 }}>
                      {responseMessage.split("\n").map((message, index) =>
                        message && <li key={index}>{message}</li>
                      )}
                    </ul>
                    : responseMessage}
                </div>
              }
              {modalShow === "SignUp" &&
                <p style={{ fontSize: 12 }}>
                  By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
                  Luna Tweets may use your contact information, including your email address and phone number
                  for purposes outlined in our Privacy Policy, like keeping you account secure and personalising
                  our services, including ads. Learn more. Others will be able to find you by email or phone
                  number, when provided, unless you choose otherwise here.
                </p>
              }

              <Button className="rounded-pill" type={isLoading ? "" : "submit"}>
                {isLoading
                  ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        className="me-2"
                        role="status"
                        size="sm"
                      />
                      <span>Loading...</span>
                    </>
                  )
                  : (
                    modalShow === "SignUp" ? "Sign Up" : "Log In"
                  )}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
