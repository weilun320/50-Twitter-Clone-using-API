import { Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ProfilePostCard from "../components/ProfilePostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentCard from "../components/CommentCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByPost } from "../features/comments/commentsSlice";

export default function SinglePostPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { post, userId } = location.state || {};

  const [views, setViews] = useState(post ? post.views : 0);

  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comments.comments);

  useEffect(() => {
    if (!location.state) {
      navigate("/search");
      return;
    }

    if (post.user_id !== userId) {
      axios.put(`${process.env.BASE_URL}/posts/views/${post.id}`, { views: post.views + 1 })
        .then((res) => {
          console.log(res.data);
          setViews(res.data.views);
        })
        .catch((error) => console.error("Error: ", error));
    }

    dispatch(fetchCommentsByPost(post.id));
  }, [dispatch, location, navigate, post, userId]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <h3 className="my-3 mx-2">Post</h3>
      <ProfilePostCard post={{ ...post, views }} clickable={false} />
      {comments && comments.length > 0 && comments.map((comment) => (
        <CommentCard key={comment.id} userId={userId} comment={comment} postId={post.id} />
      ))}
    </Col>
  );
}
