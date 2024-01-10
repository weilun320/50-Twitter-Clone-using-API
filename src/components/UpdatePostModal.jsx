import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function UpdatePostModal({ show, handleClose, userId, post }) {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.content) {
      setPostContent(post.content);
    }
  }, [post]);

  const handleUpdatePost = () => {
    if (!postContent) {
      return;
    }

    setLoading(true);

    axios.put(`${process.env.BASE_URL}/posts/${post.id}`, { ...post, content: postContent })
      .then((res) => {
        console.log(res.data);
        dispatch(fetchPostsByUser(userId));
        handleClose();
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error: ", error);
        setLoading(false);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="post-content">
            <Form.Control
              as="textarea"
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What is happening?!"
              style={{ height: 100, resize: "none" }}
              value={postContent}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-pill"
          onClick={loading ? null : handleUpdatePost}
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
