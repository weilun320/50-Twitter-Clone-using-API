import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchCommentsByPost } from "../features/comments/commentsSlice";

export default function NewCommentModal({ show, handleClose, userDetails, userId, post, comments, setComments }) {
  const [postCreatedAt, setPostCreatedAt] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${process.env.BASE_URL}/profile/${userId}`)
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch((error) => console.error("Error: ", error));

    const getPostCreatedTime = () => {
      const createdAt = new Date(post.created_at);
      const currentDate = new Date();
      const timeDifference = Math.abs(currentDate - createdAt) / (1000 * 60 * 60);

      if (createdAt.getFullYear() !== new Date().getFullYear()) {
        // Post created year is not current year
        setPostCreatedAt(`${createdAt.toLocaleString("default", { month: "short" })} ${createdAt.getDate()}, ${createdAt.getFullYear()}`);
      }
      else if (timeDifference >= 24) {
        // Post created time is more than 1 day
        setPostCreatedAt(`${createdAt.toLocaleString("default", { month: "short" })} ${createdAt.getDate()}`);
      }
      else if (timeDifference >= 1) {
        // Post created time is more than 60 minutes
        setPostCreatedAt(`${Math.floor(timeDifference)}h`);
      }
      else if (Math.floor(timeDifference * 60) === 0) {
        // Post created time less than 1 minute
        setPostCreatedAt("Just now");
      }
      else {
        // Post created time more than 1 minute but less than 60 minutes
        setPostCreatedAt(`${Math.floor(timeDifference * 60)}m`);
      }
    };

    getPostCreatedTime();
  }, [post, userId]);

  const handleReply = () => {
    if (!comment) {
      return;
    }

    setLoading(true);

    const data = {
      user_id: userId,
      post_id: post.id,
      content: comment
    };

    axios.post(`${process.env.BASE_URL}/comments`, data)
      .then((res) => {
        console.log(res.data);
        setComments([...comments, { ...res.data, comments_id: res.data.id }]);
        dispatch(fetchCommentsByPost(post.id));
        handleClose();
        setComment("");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setLoading(false);
      })
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <Row>
          <Col sm="auto">
            <div className="rounded-circle" style={{
              backgroundBlendMode: "multiply",
              backgroundColor: "#ccc",
              backgroundImage: userDetails && userDetails.profileImage && `url(${process.env.BASE_URL}/${userDetails.profileImage.replace(/\\/g, "/")})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: 40,
              width: 40,
            }}>
            </div>
          </Col>
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">
                <strong>{userDetails && userDetails.name ? userDetails.name : userDetails && userDetails.email.split("@")[0]}</strong>
                <span className="text-secondary ms-1">
                  @{userDetails && userDetails.username ? userDetails.username : userDetails && userDetails.email.split("@")[0]}
                  {` • ${postCreatedAt}`}
                </span>
              </p>
            </div>
            <p>{post.content}</p>
            <p className="text-secondary" style={{ fontSize: 15 }}>
              Replying to
              <span className="text-primary ms-1">
                @{userDetails && userDetails.username ? userDetails.username : userDetails && userDetails.email.split("@")[0]}
              </span>
            </p>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col sm="auto">
            <div className="rounded-circle" style={{
              backgroundBlendMode: "multiply",
              backgroundColor: "#ccc",
              backgroundImage: currentUser && currentUser.profileImage && `url(${process.env.BASE_URL}/${currentUser.profileImage.replace(/\\/g, "/")})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: 40,
              width: 40,
            }}>
            </div>
          </Col>
          <Col>
            <Form>
              <Form.Group controlId="comment">
                <Form.Control
                  as="textarea"
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Post your reply"
                  rows={3}
                  style={{ height: 100, resize: "none" }}
                  value={comment}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button className="rounded-pill" variant="primary" onClick={loading ? null : handleReply}>
          {loading ? (
            <>
              <Spinner
                animation="border"
                as="span"
                className="me-2"
                size="sm"
              />
              <span>Loading...</span>
            </>
          ) : "Reply"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
