import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UsersToFollowCard from "../components/UsersToFollowCard";

export default function UsersToFollowPage() {
  const BASE_URL = "https://b8b50c4b-de8f-426c-ad74-875a697d35e4-00-ppgcvyyh91fa.teams.replit.dev";

  const navigate = useNavigate();
  const [notFollowing, setNotFollowing] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

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

        const fetchNotFollowingUser = async () => {
          try {
            const res = await fetch(`${BASE_URL}/follows/${userId}`);
            const data = await res.json();

            setNotFollowing(data);
          } catch (error) {
            console.error(error);
          }
        };

        fetchNotFollowingUser();
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <>
      <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
        <h4 className="my-3">Who to follow</h4>
        {notFollowing.length > 0 && notFollowing.map((user) =>
          <UsersToFollowCard key={user.id} userId={user.id} currentUserId={currentUserId} />
        )}
      </Col>
    </>
  );
}
