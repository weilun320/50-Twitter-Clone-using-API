import { BrowserRouter, Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from "react-redux";
import store from "./store";
import { Container, Row } from "react-bootstrap";
import ProfileSideBar from "./components/ProfileSideBar";
import useLocalStorage from "use-local-storage";
import { useEffect } from "react";
import UsersToFollowPage from "./pages/UsersToFollowPage";
import "./App.css";
import SearchPage from "./pages/SearchPage";
import SinglePostPage from "./pages/SinglePostPage";
import UsersToFollowSection from "./components/UsersToFollowSection";

export function Layout() {
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");
  const navigate = useNavigate();

  // Check for authToken immediately upon component mount and whenever authToken changes
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if no authToken is present
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken(""); // Clear token from localStorage
  };

  return (
    <>
      {authToken ? (
        <Container>
          <Row>
            <ProfileSideBar handleLogout={handleLogout} />
            <Outlet />
            {window.location.pathname !== "/connect_people" &&
              <UsersToFollowSection />
            }
          </Row>
        </Container>
      ) : (
        <Outlet />
      )}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/profile" />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/connect_people" element={<UsersToFollowPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/post/:postId" element={<SinglePostPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="*" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
