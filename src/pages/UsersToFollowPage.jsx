import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UsersToFollowCard from "../components/UsersToFollowCard";

export default function UsersToFollowPage() {
  const navigate = useNavigate();

  const [notFollowing, setNotFollowing] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotFollowingUser = async (userId) => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/follows/${userId}`);
      const data = await res.json();

      setNotFollowing(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
    }
    else {
      try {
        const decode = jwtDecode(token);
        const userId = decode.id;
        setCurrentUserId(userId);

        fetchNotFollowingUser(userId);
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleSearchUser = () => {
    setErrorMessage("");
    setNotFollowing([]);

    if (!keyword) {
      fetchNotFollowingUser(currentUserId);
      return;
    }

    fetch(`${process.env.BASE_URL}/search/users/${keyword}`)
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => setNotFollowing(data));
        }
        else {
          return res.json().then((data) => setErrorMessage(data.error));
        }
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <>
      <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
        <h4 className="my-3">Connect</h4>
        <InputGroup className="my-3">
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? handleSearchUser() : null}
            placeholder="Search"
            type="text"
            value={keyword}
          />
        </InputGroup>
        {errorMessage && <p>{errorMessage}</p>}
        {notFollowing && notFollowing.length > 0 && notFollowing.map((user) =>
          <UsersToFollowCard key={user.id} userId={user.id} currentUserId={currentUserId} />
        )}
      </Col>
    </>
  );
}
