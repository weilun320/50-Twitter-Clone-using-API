import { Button, Col, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import ProfileEditModal from "./ProfileEditModal";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";
import { fetchUserDetails } from "../features/users/usersSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileMidBody() {
  const url = "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";
  const BASE_URL = "https://b8b50c4b-de8f-426c-ad74-875a697d35e4-00-ppgcvyyh91fa.teams.replit.dev";

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const userDetails = useSelector((state) => state.users.userDetails);
  const userLoading = useSelector((state) => state.users.loading);

  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login");
      return;
    }
    else {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        dispatch(fetchPostsByUser(userId));
        dispatch(fetchUserDetails(userId));

        const fetchFollowers = async () => {
          try {
            const res = await axios.get(`${BASE_URL}/follows/count/${userId}`);

            setFollower(res.data.follower);
            setFollowing(res.data.following);
          } catch (error) {
            console.error(error);
          }
        };

        fetchFollowers();
      } catch (error) {
        navigate("/login");
      }
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
        <div className="position-relative w-100" style={{
          backgroundBlendMode: "multiply",
          backgroundColor: "#ccc",
          backgroundImage: userDetails && userDetails.bannerImage && `url(${BASE_URL}/${userDetails.bannerImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: 180,
        }}>
        </div>
        <br />
        <div className="position-absolute rounded-circle" style={{
          backgroundBlendMode: "multiply",
          backgroundColor: "#ccc",
          backgroundImage: userDetails && userDetails.profileImage && `url(${BASE_URL}/${userDetails.profileImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          border: "4px solid #F8F9FA",
          height: 150,
          marginLeft: 15,
          top: 120,
          width: 150,
        }}>
        </div>

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

        {userLoading ? (
          <Spinner animation="border" className="ms-3 mt-3" variant="primary" />
        ) : (
          <>
            <p className="mt-5 fw-bold" style={{ margin: 0 }}>
              {userDetails && userDetails.name ? userDetails.name : userDetails.email.split("@")[0]}
            </p>

            <p className="text-secondary" style={{ fontSize: 15 }}>
              @{userDetails && userDetails.username ? userDetails.username : userDetails.email.split("@")[0]}
            </p>

            <p className="mb-2" style={{ fontSize: 15 }}>{userDetails && userDetails.bio}</p>

            <p>
              <strong>{following}</strong> Following <strong> {follower}</strong> Followers
            </p>
          </>
        )}

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
          <ProfilePostCard key={post.id} post={post} userDetails={userDetails} />
        ))}
      </Col>
      <ProfileEditModal show={show} handleClose={handleClose} userDetails={userDetails} />
    </>
  );
}
