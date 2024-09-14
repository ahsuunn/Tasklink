import { useContext } from "react";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import { NavLink } from "react-router-dom";
import logopic from "../pages/images/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const currentUserContext = useContext(CurrentUserContext);
  console.log("email: ", currentUserContext?.currentUser?.email);
  return (
    <nav className="navbar">
      <div className="logo min-w-20">
        <NavLink to="/">
          <img src={logopic} alt="Logo" width="180px" />
        </NavLink>
      </div>
      <ul className="navbar-list flex flex-row justify-center">
        <li>
          <NavLink to="/" className="hover:text-black">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            className="hover:text-black"
          >
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/findmybuddies"
            className="hover:text-black"
          >
            Find My Buddies
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/profile/edit/${currentUserContext?.currentUser?.email}`}
            className="hover:text-black"
          >
            Settings
          </NavLink>
        </li>
      </ul>

      {/* Profile Section */}
      <div className="profile">
        <ul>
          <li>
            <NavLink to="">
              <div className="profile-btn reverse">
                <div className="profile-img"></div>
                <div className="username">
                  <span className="username">
                    {currentUserContext?.currentUser?.displayName}
                  </span>
                </div>
              </div>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
