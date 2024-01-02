import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";

export default function ProfilePostCard({ content, postId }) {
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  const BASE_URL = "https://twitter-api-weilun9320.sigma-school-full-stack.repl.co";

  const [likes, setLikes] = useState([]);

  // Decoding to get the user ID
  const token = localStorage.getItem("authToken");
  const decode = jwtDecode(token);
  const userId = decode.id;

  useEffect(() => {
    fetch(`${BASE_URL}/likes/post/${postId}`)
      .then((res) => res.json())
      .then((data) => setLikes(data))
      .catch((error) => console.error("Error: ", error));
  }, [postId]);

  const isLiked = likes.some((like) => like.user_id === userId);

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    axios.post(`${BASE_URL}/likes`, {
      user_id: userId,
      post_id: postId,
    })
      .then((res) => {
        setLikes([...likes, { ...res.data, likes_id: res.data.id }]);
      })
      .catch((error) => console.error("Error: ", error));
  };

  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);

    if (like) {
      axios
        .put(`${BASE_URL}/likes/${userId}/${postId}`) // Include userId and postId in the URL
        .then(() => {
          // Update the state to reflect the removal of the like
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
        })
        .catch((error) => console.error("Error: ", error));
    }
  };

  return (
    <Row
      className="p-3"
      style={{
        borderTop: "1px solid #D3D3D3",
        borderBottom: "1px solid #D3D3D3"
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <strong>Haris</strong>
        <span> @haris.samingan • Jan 2</span>
        <p>{content}</p>
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onClick={handleLike}>
            {isLiked ? (
              <i className="bi bi-heart-fill text-danger me-2"></i>
            ) : (
              <i className="bi bi-heart me-2"></i>
            )}
            {likes.length}
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
