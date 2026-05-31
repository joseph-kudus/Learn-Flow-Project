import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default.png";
import SearchBox from "./SearchBox";
import { BellIcon } from "lucide-react";

function DashboardHeader() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null;

  // Default to student and force lowercase
  const role = (userData?.role || "student").toLowerCase();

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
        <div className="header-left">
          {/* Show search bar only for students */}
          {role === "student" && <SearchBox />}
        </div>

        <div className="flex gap-4 ml-auto items-center">
          {/* Notification only show to students */}
          {role === "student" && (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <BellIcon size={20} />
            </button>
          )}

          <div className="MyAcc-wraper">
            <Link to="/dashboard/settings" className="myacc">
              <div className="userinfo">
                <h4>{displayName}</h4>
                <p className="capitalize">{role}</p>{" "}
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
    </div>
  );
}

export default DashboardHeader;
