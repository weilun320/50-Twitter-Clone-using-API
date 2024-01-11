import { Button, Col, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import ProfileEditModal from "./ProfileEditModal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsByUser } from "../features/posts/postsSlice";
import { fetchUserDetails } from "../features/users/usersSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfileMidBody({ userId, currentUserId }) {
  const url = "https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500";
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

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
  const [isFollowed, setIsFollowed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPostsByUser(userId));
    dispatch(fetchUserDetails(userId));

    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`${process.env.BASE_URL}/follows/count/${userId}`);

        setFollower(res.data.follower);
        setFollowing(res.data.following);
      } catch (error) {
        console.error(error);
      }
    };

    const setIsFollowedState = async () => {
      fetch(`${process.env.BASE_URL}/follows/${currentUserId}/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setIsFollowed(data.following);
        })
        .catch((error) => console.error("Error: ", error));
    };

    fetchFollowers();

    if (userId !== currentUserId) {
      setIsFollowedState();
    }
  }, [currentUserId, dispatch, navigate, userId]);

  const handleFollow = () => isFollowed ? removeFromFollows() : addToFollows();

  const addToFollows = () => {
    axios.post(`${process.env.BASE_URL}/follows`, {
      user_id: currentUserId,
      following_user_id: userId,
    })
      .then(() => {
        setIsFollowed(true);
        setFollower((prevFollower) => prevFollower + 1);
      })
      .catch((error) => console.error("Error: ", error));
  };

  const removeFromFollows = () => {
    if (isFollowed) {
      axios.put(`${process.env.BASE_URL}/follows/${currentUserId}/${userId}`)
        .then(() => {
          setIsFollowed(false);
          setFollower((prevFollower) => prevFollower - 1);
        })
        .catch((error) => console.error("Error: ", error));
    }
  };

  return (
    <>
      <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
        <div className="position-relative w-100 default-image-container" style={{
          backgroundImage: userDetails && userDetails.bannerImage && `url(${process.env.BASE_URL}/${userDetails.bannerImage.replace(/\\/g, "/")})`,
          height: 180,
        }}>
        </div>
        <br />
        <div className="position-absolute rounded-circle default-image-container" style={{
          backgroundImage: userDetails && userDetails.profileImage && `url(${process.env.BASE_URL}/${userDetails.profileImage.replace(/\\/g, "/")})`,
          border: "4px solid #F8F9FA",
          height: 150,
          marginLeft: 15,
          top: 120,
          width: 150,
        }}>
        </div>

        <Row className="justify-content-end">
          <Col xs="auto">
            {userId === currentUserId ? (
              <Button
                className="rounded-pill mt-2"
                variant="outline-secondary"
                onClick={handleShow}
              >
                Edit Profile
              </Button>
            ) : isFollowed ? (
              <Button
                className="rounded-pill"
                variant="outline-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow();
                }}>
                Unfollow
              </Button>
            ) : (
              <Button
                className="rounded-pill"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow();
                }}>
                Follow
              </Button>
            )}
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
          <ProfilePostCard key={post.id} post={post} clickable={true} />
        ))}
      </Col>
      {userDetails && (
        <ProfileEditModal show={show} handleClose={handleClose} userDetails={userDetails} />
      )}
    </>
  );
}
