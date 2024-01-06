import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function UpdatePostModal({ show, handleClose, userId, post, BASE_URL }) {
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (post.content) {
      setPostContent(post.content);
    }
  }, [post]);

  const handleUpdatePost = () => {
    axios.put(`${BASE_URL}/posts/${post.id}`, { ...post, content: postContent })
      .then((res) => {
        console.log(res.data);
        dispatch(fetchPostsByUser(userId));
        handleClose();
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
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
              value={postContent}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-pill"
          onClick={handleUpdatePost}
          variant="primary"
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
