import { Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePostCard from "../components/ProfilePostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentCard from "../components/CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByPost } from "../features/comments/commentsSlice";
import { jwtDecode } from "jwt-decode";

export default function SinglePostPage() {
  const navigate = useNavigate();

  const postId = parseInt(useParams().postId);

  const [userId, setUserId] = useState(null);
  const [post, setPost] = useState(null);
  const [views, setViews] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }
    else {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.id);
      } catch (error) {
        navigate("/login");
        return;
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (userId && postId) {
      fetch(`${process.env.BASE_URL}/posts/${postId}`)
        .then((res) => {
          if (res.ok) {
            return res.json().then((data) => {
              setPost(data);

              if (data.user_id !== userId) {
                axios.put(`${process.env.BASE_URL}/posts/views/${data.id}`, { views: data.views + 1 })
                  .then((res) => {
                    console.log(res.data);
                    setViews(res.data.views);
                  })
                  .catch((error) => console.error("Error: ", error));
              }
            });
          }
          else {
            return res.json().then((data) => setErrorMessage(data.error));
          }
        })
        .catch((error) => console.error("Error: ", error));

      dispatch(fetchCommentsByPost(postId));
    }
  }, [dispatch, postId, userId]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <h3 className="my-3 mx-2">Post</h3>
      {errorMessage && <p>{errorMessage}</p>}
      {post &&
        <ProfilePostCard post={{ ...post, views }} clickable={false} />
      }
      {comments && comments.length > 0 && comments.map((comment) => (
        <CommentCard key={comment.id} userId={userId} comment={comment} postId={postId} />
      ))}
    </Col>
  );
}
