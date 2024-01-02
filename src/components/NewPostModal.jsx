import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function NewPostModal({ show, handleClose }) {
  const [postContent, setPostContent] = useState("");

  const handleSave = () => {
    // Get stored JWT Token
    const token = localStorage.getItem("authToken");

    // Decode the token to fetch user ID
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id; // May change depending on how the server encode the token

    // Prepare data to be sent
    const data = {
      title: "Post Title", // Add functionality to set this properly
      content: postContent,
      user_id: userId,
    };

    // Make API call
    axios
      .post("https://twitter-api-weilun9320.sigma-school-full-stack.repl.co/posts", data)
      .then((res) => {
        console.log("Success: ", res.data);
        handleClose();
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
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
