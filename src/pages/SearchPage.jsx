import { useState } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import ProfilePostCard from "../components/ProfilePostCard";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchPost = () => {
    setErrorMessage("");
    setPosts([]);

    if (!keyword) {
      return;
    }

    fetch(`${process.env.BASE_URL}/search/posts/${keyword}`)
      .then((res) => {
        if (res.ok) {
          return res.json().then((data) => setPosts(data));
        }
        else {
          return res.json().then((data) => setErrorMessage(data.error));
        }
      })
      .catch((error) => console.error("Error: ", error));
  };

  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <InputGroup className="my-3">
        <InputGroup.Text>
          <i className="bi bi-search"></i>
        </InputGroup.Text>
        <Form.Control
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" ? handleSearchPost() : null}
          placeholder="Search"
          type="text"
          value={keyword}
        />
      </InputGroup>
      {errorMessage && <p>{errorMessage}</p>}
      {posts.length > 0 && posts.map((post) => (
        <ProfilePostCard key={post.id} post={post} clickable={true} />
      ))}
    </Col>
  );
}
