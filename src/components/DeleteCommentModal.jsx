import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchCommentsByPost } from "../features/comments/commentsSlice";

export default function DeleteCommentModal({ show, handleClose, commentId, postId }) {
  const dispatch = useDispatch();

  const handleDeleteComment = () => {
    axios.delete(`${process.env.BASE_URL}/comments/${commentId}`)
      .then((res) => {
        console.log(res.data);
        dispatch(fetchCommentsByPost(postId));
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleDeleteComment}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
