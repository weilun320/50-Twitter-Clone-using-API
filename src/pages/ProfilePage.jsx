import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const handleLogout = () => { };

  return (
    <>
      <Navbar bg="light" expand="md">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i
              className="bi bi-twitter"
              style={{ fontSize: 30, color: "dodgerblue" }}
            ></i>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-3">
        <h2>Your profile</h2>
      </Container>
    </>
  );
}
