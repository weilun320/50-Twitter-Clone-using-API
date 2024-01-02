import { useRef, useState } from "react";
import { Button, FloatingLabel, Form, Image, Modal } from "react-bootstrap";

export default function ProfileEditModal({ show, handleClose }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const profileImageInputRef = useRef();

  const handleProfileImageClick = () => {
    profileImageInputRef.current.click();
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMessage("");

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(selectedFile?.type)) {
      setErrorMessage("Only JPEG, PNG and GIF images are allowed");
      setImageFile(null);

      return;
    }

    setImageFile(selectedFile);
    setProfileImage(URL.createObjectURL(selectedFile));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form encType="multipart/form-data">
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
          <Button className="fw-semibold rounded-pill" variant="primary ms-auto">Save</Button>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="profile-image">
            <div className="position-relative" style={{ width: "fit-content" }}>
              <Image
                className="object-fit-cover border"
                height={100}
                roundedCircle
                src={profileImage ? profileImage : "./assets/default-profile-image.png"}
                width={100}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                style={{ backgroundColor: "rgba(0, 0, 0, .2)" }}
              ></div>
              <div className="position-absolute top-50 start-50 translate-middle">
                <Form.Control
                  accept="image/*"
                  onChange={handleFileChange}
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
            {errorMessage && <p className="text-danger mb-0">{errorMessage}</p>}
          </Form.Group>
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
        </Modal.Body>
      </Form>
    </Modal>
  )
}
