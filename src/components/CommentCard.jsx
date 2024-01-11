import { useEffect, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import DeleteCommentModal from "./DeleteCommentModal";
import UpdateCommentModal from "./UpdateCommentModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CommentCard({ userId, comment, postId }) {
  const [userDetails, setUserDetails] = useState(null);
  const [commentCreatedAt, setCommentCreatedAt] = useState("");
  const [modal, setModal] = useState("");
  const [likes, setLikes] = useState([]);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setModal("");
  };
  const handleShow = (action) => {
    setShow(true);
    setModal(action);
  };

  useEffect(() => {
    fetch(`${process.env.BASE_URL}/profile/${comment.user_id}`)
      .then((res) => res.json())
      .then((data) => setUserDetails(data))
      .catch((error) => console.error("Error: ", error));

    fetch(`${process.env.BASE_URL}/comment_likes/comment/${comment.id}`)
      .then((res) => res.json())
      .then((data) => setLikes(data))
      .catch((error) => console.error("Error: ", error));

    const getCommentCreatedTime = () => {
      const createdAt = new Date(comment.created_at);
      const currentDate = new Date();
      const timeDifference = Math.abs(currentDate - createdAt) / (1000 * 60 * 60);

      if (createdAt.getFullYear() !== new Date().getFullYear()) {
        // Post created year is not current year
        setCommentCreatedAt(`${createdAt.toLocaleString("default", { month: "short" })} ${createdAt.getDate()}, ${createdAt.getFullYear()}`);
      }
      else if (timeDifference >= 24) {
        // Post created time is more than 1 day
        setCommentCreatedAt(`${createdAt.toLocaleString("default", { month: "short" })} ${createdAt.getDate()}`);
      }
      else if (timeDifference >= 1) {
        // Post created time is more than 60 minutes
        setCommentCreatedAt(`${Math.floor(timeDifference)}h`);
      }
      else if (Math.floor(timeDifference * 60) === 0) {
        // Post created time less than 1 minute
        setCommentCreatedAt("Just now");
      }
      else {
        // Post created time more than 1 minute but less than 60 minutes
        setCommentCreatedAt(`${Math.floor(timeDifference * 60)}m`);
      }
    };

    getCommentCreatedTime();
  }, [comment]);

  const isLiked = likes.some((like) => like.user_id === userId);

  const handleLike = () => (isLiked ? removeFromLikes() : addToLikes());

  const addToLikes = () => {
    axios.post(`${process.env.BASE_URL}/comment_likes`, {
      user_id: userId,
      comment_id: comment.id,
    })
      .then((res) => {
        setLikes([...likes, { ...res.data, comment_likes_id: res.data.id }]);
      })
      .catch((error) => console.error("Error: ", error));
  };

  const removeFromLikes = () => {
    const like = likes.find((like) => like.user_id === userId);

    if (like) {
      axios
        .put(`${process.env.BASE_URL}/comment_likes/${userId}/${comment.id}`) // Include userId and postId in the URL
        .then(() => {
          // Update the state to reflect the removal of the like
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
        })
        .catch((error) => console.error("Error: ", error));
    }
  }

  const handleNavigateUser = (currentUserId) => {
    if (currentUserId !== userId) {
      navigate(`/profile/${currentUserId}`);
    }
    else {
      navigate("/profile");
    }
  };

  return (
    <>
      <Row
        className="p-3"
        style={{
          borderTop: "1px solid #D3D3D3",
          borderBottom: "1px solid #D3D3D3"
        }}
      >
        <Col sm={1} className="px-0">
          <div
            className="rounded-circle mx-auto default-image-container active"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateUser(comment.user_id);
            }}
            style={{
              backgroundImage: userDetails && userDetails.profileImage && `url(${process.env.BASE_URL}/${userDetails.profileImage.replace(/\\/g, "/")})`,
              height: 40,
              width: 40,
            }}>
          </div>
        </Col>

        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              <strong
                className="link active"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateUser(comment.user_id);
                }}
              >
                {userDetails && userDetails.name ? userDetails.name : userDetails && userDetails.email.split("@")[0]}
              </strong>
              <span
                className="text-secondary ms-1 link"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateUser(comment.user_id);
                }}
              >
                @{userDetails && userDetails.username ? userDetails.username : userDetails && userDetails.email.split("@")[0]}
              </span>
              <span className="text-secondary">{` • ${commentCreatedAt}`}</span>
            </p>

            <DropdownButton
              variant="light"
              title={<i className="bi bi-three-dots"></i>}
              disabled={comment.user_id !== userId}
              onClick={(e) => e.stopPropagation()}
            >
              {comment.user_id === userId && (
                <>
                  <Dropdown.Item onClick={() => handleShow("edit")}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleShow("delete")}>Delete</Dropdown.Item>
                </>
              )}
            </DropdownButton>
          </div>
          <p>{comment.content}</p>
          <div className="d-flex justify-content-between">
            <Button
              variant="light">
              <i className="bi bi-chat"></i>
            </Button>
            <Button variant="light">
              <i className="bi bi-repeat"></i>
            </Button>
            <Button
              variant="light"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
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
      {modal === "edit" ? (
        <UpdateCommentModal
          show={show}
          handleClose={handleClose}
          comment={comment}
          postId={postId}
        />
      ) : (
        <DeleteCommentModal
          show={show}
          handleClose={handleClose}
          commentId={comment.id}
          postId={postId}
        />
      )}
    </>
  );
}
