import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "use-local-storage";
import ProfileEditModal from "../components/ProfileEditModal";
import ProfileSideBar from "../components/ProfileSideBar";

export default function ProfilePage() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  // Check for authToken immediately upon component mount and whenever authToken changes
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if no authToken is present
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken(""); // Clear token from localStorage
  };

  return (
    <>
      <Container className="mt-3">
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
        </Row>
      </Container>
      <ProfileEditModal show={show} handleClose={handleClose} />
    </>
  );
}
