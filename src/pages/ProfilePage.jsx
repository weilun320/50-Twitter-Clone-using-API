import { useNavigate, useParams } from "react-router-dom";
import ProfileMidBody from "../components/ProfileMidBody";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function ProfilePage() {
  const userId = parseInt(useParams().userId);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [checkExistance, setCheckExistance] = useState(false);
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
        setCurrentUserId(decodedToken.id);
      } catch (error) {
        navigate("/login");
      }
    }

    const checkUserExist = async () => {
      fetch(`${process.env.BASE_URL}/profile/${userId}`)
        .then((res) => {
          if (!res.ok) {
            navigate("/connect_people");
            return;
          }
          else {
            setCheckExistance(true);
          }
        })
        .catch((error) => console.error("Error: ", error));
    };

    if (userId) {
      checkUserExist();
    }
    else {
      setCheckExistance(true);
    }
  }, [navigate, userId]);

  return checkExistance && (
    <ProfileMidBody userId={userId ? userId : currentUserId} currentUserId={currentUserId} />
  );
}
