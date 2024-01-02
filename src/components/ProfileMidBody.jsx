import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import ProfileEditModal from "./ProfileEditModal";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";

export default function ProfileMidBody() {
  const url = "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      dispatch(fetchPostsByUser(userId));
    }
  }, [dispatch]);

  return (
    <>
      <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
        <Image src={url} fluid />
        <br />
        <Image
          src={pic}
          roundedCircle
          style={{
            border: "4px solid #F8F9FA",
            marginLeft: 15,
            position: "absolute",
            top: 140,
            width: 150,
          }}
        />

        <Row className="justify-content-end">
          <Col xs="auto">
            <Button
              className="rounded-pill mt-2"
              variant="outline-secondary"
              onClick={handleShow}
            >
              Edit Profile
            </Button>
          </Col>
        </Row>

        <p className="mt-5 fw-bold" style={{ margin: 0, fontSize: 15 }}>
          Haris
        </p>

        <p style={{ marginBottom: 2 }}>@haris.samingan</p>

        <p>I help people switch careers to be a software developer at sigmaschool.co</p>

        <p>Entrepreneur</p>

        <p>
          <strong>271</strong> Following <strong>610</strong> Followers
        </p>

        <Nav variant="underline" defaultActiveKey="/home" justify>
          <Nav.Item>
            <Nav.Link eventKey="/home">Tweets</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-1">Replies</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-2">Highlights</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">Media</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-4">Likes</Nav.Link>
          </Nav.Item>
        </Nav>
        {loading && (
          <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
        )}
        {posts.length > 0 && posts.map((post) => (
          <ProfilePostCard key={post.id} content={post.content} postId={post.id} />
        ))}
      </Col>
      <ProfileEditModal show={show} handleClose={handleClose} />
    </>
  );
}
