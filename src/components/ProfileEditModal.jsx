import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { Button, FloatingLabel, Form, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { fetchUserDetails } from "../features/users/usersSlice";

export default function ProfileEditModal({ show, handleClose, userDetails }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [isProfileImageUploaded, setIsProfileImageUploaded] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImage, setBannerImage] = useState("");
  const [isBannerImageUploaded, setIsBannerImageUploaded] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username ? userDetails.username : "");
      setName(userDetails.name ? userDetails.name : "");
      setBio(userDetails.bio ? userDetails.bio : "");
      setProfileImage(userDetails.profileImage);
      setBannerImage(userDetails.bannerImage);
    }
  }, [userDetails]);

  const profileImageInputRef = useRef();
  const bannerImageInputRef = useRef();

  const handleProfileImageClick = () => {
    profileImageInputRef.current.click();
  }

  const handleBannerImageClick = () => {
    bannerImageInputRef.current.click();
  }

  const handleProfileImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMessage("");

    if (!selectedFile) {
      return;
    }

    // Ensure uploaded file type is image
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile?.type)) {
      setErrorMessage("Only JPEG, PNG and GIF images are allowed");
      setProfileImageFile(null);

      return;
    }

    setProfileImageFile(selectedFile);
    setProfileImage(URL.createObjectURL(selectedFile));
    setIsProfileImageUploaded(true);
  };

  const handleBannerImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMessage("");

    if (!selectedFile) {
      return;
    }

    // Ensure uploaded file type is image
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile?.type)) {
      setErrorMessage("Only JPEG, PNG and GIF images are allowed");
      setBannerImageFile(null);

      return;
    }

    setBannerImageFile(selectedFile);
    setBannerImage(URL.createObjectURL(selectedFile));
    setIsBannerImageUploaded(true);
  };

  const handleSaveProfileDetails = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    // Ensure username is entered
    if (!username) {
      setErrorMessage("Username can't be empty.");
      setIsLoading(false);
      return;
    }

    // Ensure name is entered
    if (!name) {
      setErrorMessage("Name can't be empty.");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;
    const data = { username, name, bio, profileImage: profileImageFile, bannerImage: bannerImageFile };

    try {
      const res = await axios.post(`${process.env.BASE_URL}/profile/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
      setIsLoading(false);
      // Reset all file input
      setProfileImage(null);
      setProfileImageFile(null);
      setIsProfileImageUploaded(false);
      setBannerImage(null);
      setBannerImageFile(null);
      setIsBannerImageUploaded(false);
      // Close modal
      handleClose();
      // Rerender user's details
      dispatch(fetchUserDetails(userId));
    } catch (error) {
      console.error(error);
      // Set error message from API
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      }
      else if (error.response && error.response.status === 500) {
        setErrorMessage(error.response.data.error);
        setIsLoading(false);
      }
      else {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form encType="multipart/form-data" onSubmit={handleSaveProfileDetails}>
        <Modal.Header className="justify-content-start">
          <Button
            className="me-3 rounded-circle"
            onClick={() => handleClose()}
            style={{ height: 42, width: 42 }}
            variant="light"
          >
            <i className="bi bi-x-lg"></i>
          </Button>
          <span className="fw-bold fs-4">Edit Profile</span>
          <Button
            className="fw-semibold rounded-pill"
            type={isLoading ? "" : "submit"}
            variant="primary ms-auto"
          >
            {isLoading ? (
              <>
                <Spinner
                  animation="border"
                  as="span"
                  className="me-2"
                  size="sm"
                />
                <span>Loading...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="position-relative w-100 default-image-container" style={{
            backgroundImage: bannerImage && isBannerImageUploaded ? bannerImage && `url(${bannerImage})` : userDetails && userDetails.bannerImage && bannerImage && `url(${process.env.BASE_URL}/${bannerImage.replace(/\\/g, "/")})`,
            height: 150,
          }}>
            <div className="position-absolute top-50 start-50 translate-middle">
              <Form.Control
                accept="image/*"
                onChange={handleBannerImageChange}
                ref={bannerImageInputRef}
                style={{ display: "none" }}
                type="file"
              />
              <Button
                className="rounded-circle"
                onClick={handleBannerImageClick}
                style={{ backgroundColor: "rgba(0, 0, 0, .5)", height: 42, width: 42 }}
                variant="dark"
              >
                <i className="bi bi-camera"></i>
              </Button>
            </div>
            <div className="position-absolute rounded-circle default-image-container" style={{
              backgroundImage: profileImage && isProfileImageUploaded ? profileImage && `url(${profileImage})` : userDetails && userDetails.profileImage && profileImage && `url(${process.env.BASE_URL}/${profileImage.replace(/\\/g, "/")})`,
              border: "3px solid #F8F9FA",
              height: 100,
              marginLeft: 14,
              top: 90,
              width: 100,
            }}>
              <div className="position-absolute top-50 start-50 translate-middle">
                <Form.Control
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  ref={profileImageInputRef}
                  style={{ display: "none" }}
                  type="file"
                />
                <Button
                  className="rounded-circle"
                  onClick={handleProfileImageClick}
                  style={{ backgroundColor: "rgba(0, 0, 0, .5)", height: 42, width: 42 }}
                  variant="dark"
                >
                  <i className="bi bi-camera"></i>
                </Button>
              </div>
            </div>
          </div>
          <FloatingLabel className="mt-5 mb-3" controlId="username" label="Username">
            <Form.Control
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              type="text"
              value={username}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" controlId="name" label="Name">
            <Form.Control
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              type="text"
              value={name}
            />
          </FloatingLabel>
          <FloatingLabel className="mb-3" controlId="bio" label="Bio">
            <Form.Control
              as="textarea"
              onChange={(e) => setBio(e.target.value)}
              placeholder="Bio"
              style={{ height: 100, resize: "none" }}
              type="text"
              value={bio}
            />
          </FloatingLabel>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </Modal.Body>
      </Form>
    </Modal>
  );
}
