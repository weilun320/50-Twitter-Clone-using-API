import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UsersToFollowCard({ userId, currentUserId }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true)
      fetch(`${process.env.BASE_URL}/profile/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error: ", error);
          setLoading(false);
        });
    };

    const setIsFollowedState = async () => {
      fetch(`${process.env.BASE_URL}/follows/${currentUserId}/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setIsFollowed(data.following);
        })
        .catch((error) => console.error("Error: ", error));
    };

    fetchUserDetails();
    setIsFollowedState();
  }, [currentUserId, userId]);

  const handleFollow = () => isFollowed ? removeFromFollows() : addToFollows();

  const addToFollows = () => {
    axios.post(`${process.env.BASE_URL}/follows`, {
      user_id: currentUserId,
      following_user_id: userId,
    })
      .then(() => {
        setIsFollowed(true);
      })
      .catch((error) => console.error("Error: ", error));
  };

  const removeFromFollows = () => {
    if (isFollowed) {
      axios.put(`${process.env.BASE_URL}/follows/${currentUserId}/${userId}`)
        .then(() => {
          setIsFollowed(false);
        })
        .catch((error) => console.error("Error: ", error));
    }
  };

  const handleNavigate = () => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleNavigate}>
      <Row
        className="p-3"
        style={{
          borderTop: "1px solid #D3D3D3",
          borderBottom: "1px solid #D3D3D3"
        }}
      >
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            <Col sm={1} className="px-0">
              <div className="rounded-circle mx-auto default-image-container" style={{
                backgroundBleor: "#ccc",
                backgroundImage: userDetails && userDetails.profileImage && `url(${process.env.BASE_URL}/${userDetails.profileImage})`,
                height: 40,
                width: 40,
              }}>
              </div>
            </Col>

            <Col>
              <p
                className="fw-bold" style={{ margin: 0 }}>
                {userDetails && userDetails.name}
              </p>

              <p className="text-secondary mb-0" style={{ fontSize: 15 }}>
                @{userDetails && userDetails.username}
              </p>

              <p className="mb-0" style={{ fontSize: 15 }}>{userDetails && userDetails.bio}</p>
            </Col>

            <Col sm={3} className="text-center">
              {isFollowed ? (
                <Button
                  className="rounded-pill"
                  variant="outline-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow();
                  }}>
                  Unfollow
                </Button>
              ) : (
                <Button
                  className="rounded-pill"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFollow();
                  }}>
                  Follow
                </Button>
              )}
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}
