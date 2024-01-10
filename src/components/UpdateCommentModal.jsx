import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchCommentsByPost } from "../features/comments/commentsSlice";

export default function UpdateCommentModal({ show, handleClose, comment, postId }) {
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (comment.content) {
      setCommentContent(comment.content);
    }
  }, [comment]);

  const handleUpdateComment = () => {
    if (!commentContent) {
      return;
    }

    setLoading(true);

    axios.put(`${process.env.BASE_URL}/comments/${comment.id}`, { ...comment, content: commentContent })
      .then((res) => {
        console.log(res.data);
        dispatch(fetchCommentsByPost(postId));
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setLoading(false);
      })
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="comment-content">
            <Form.Control
              as="textarea"
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Post your reply"
              style={{ height: 100, resize: "none" }}
              value={commentContent}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-pill"
          onClick={loading ? null : handleUpdateComment}
          variant="primary"
        >
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
          ) : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
