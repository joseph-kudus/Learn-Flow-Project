import { FaBook } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default.png";
import { IoIosNotificationsOutline } from "react-icons/io";

function DashboardHeader() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null; // or redirect to /login

  // Fallback chain: nickname -> firstName -> username -> email -> "User"
  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser.email?.split("@")[0] ||
    "User";

  const avatar = userData?.photoURL || currentUser.photoURL || defaultAvatar;

  return (
    <div className="header">
      <div className="header-nav">
        <div className="logo-wraper">
          <FaBook className="logob" />
          <p>LearnFlow</p>
        </div>

        <div className="MyAcc-wraper">
          <Link to="/settings" className="myacc">
            <div className="userinfo">
              <h4>{displayName}</h4>
              <p>Learner</p>
            </div>

            <div className="userimg">
              <span className="round-circle">
                <img
                  src={avatar}
                  alt="user avatar"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default DashboardHeader;
