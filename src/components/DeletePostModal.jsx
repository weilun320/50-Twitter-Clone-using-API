import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function DeletePostModal({ show, handleClose, userId, postId }) {
  const dispatch = useDispatch();

  const handleDeletePost = () => {
    axios.delete(`${process.env.BASE_URL}/posts/${postId}`)
      .then((res) => {
        console.log(res.data);
        dispatch(fetchPostsByUser(userId));
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete post</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDeletePost}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
