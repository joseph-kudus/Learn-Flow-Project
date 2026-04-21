import { FaBook } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SearchBox from "./SearchBox";
import kudus from "../../assets/images/20250821_160921.jpg";
import { toast } from "react-toastify";
function DashboardHeader() {
  const { currentUser } = useAuth();

  return (
    <>

      {/*new header*/}
      <div className="header">
        <div className="header-nav">
          <div className="logo-wraper">
            <FaBook className="logob" />
            <p>LearnFlow</p>
          </div>
          <SearchBox />

          <div className="MyAcc-wraper">
            <div className="myacc">
              <div className="userimg">
                <span className="round-circle">
                  <img src={kudus} alt="userimg" />
                </span>
              </div>
              <div className="userinfo">
                <h4>
                  <span>{currentUser.email}</span>
                </h4>
                <p>Student</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*new header*/}
    </>
  );
}
export default DashboardHeader;
