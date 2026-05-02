import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default.png";
import { IoIosNotificationsOutline } from "react-icons/io";

function DashboardHeader() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null;

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
        <div className="header-left"></div>
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
