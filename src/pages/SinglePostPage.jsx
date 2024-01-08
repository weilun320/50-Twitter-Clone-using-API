import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ProfilePostCard from "../components/ProfilePostCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SinglePostPage() {
  const location = useLocation();
  const { post, userId } = location.state;

  const [views, setViews] = useState(post.views);

  useEffect(() => {
    if (post.user_id !== userId) {
      axios.put(`${process.env.BASE_URL}/posts/views/${post.id}`, { views: post.views + 1 })
        .then((res) => {
          console.log(res.data);
          setViews(res.data.views);
        })
        .catch((error) => console.error("Error: ", error));
    }
  }, [post, userId]);

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <h3 className="my-3 mx-2">Post</h3>
      <ProfilePostCard post={{ ...post, views }} clickable={false} />
    </Col>
  );
}
