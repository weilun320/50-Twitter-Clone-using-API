import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { savePost } from "../features/posts/postsSlice";

export default function NewPostModal({ show, handleClose }) {
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(savePost(postContent));
    handleClose();
    setPostContent("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="post-content">
              <Form.Control
                as="textarea"
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What is happening?!"
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill"
            onClick={handleSave}
            variant="primary"
          >
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
