import { FaBook } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default.png"; // add a default


function DashboardHeader() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return null; // or <HeaderSkeleton />
  if (!currentUser) return <p>Please log in</p>;

  const displayName =
    userData?.nickname || userData?.firstName || currentUser.email;
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
                <img src={avatar} alt="user avatar" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default DashboardHeader;
