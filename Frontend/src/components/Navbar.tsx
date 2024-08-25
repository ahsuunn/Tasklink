import { useContext, useEffect, useState } from "react";
import { CurrentUserContext } from "../lib/contexts/CurrentUserContext";
import { NavLink, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import { NavHashLink } from "react-router-hash-link";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <NavLink to="/">TaskLink</NavLink>
      </div>

      {/* Navbar List */}
      <ul className="navbar-list">
        <li>
          <NavLink to="/" activeClassName="active" className="hover:text-black">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calendar"
            activeClassName="active"
            className="hover:text-black"
          >
            Calendar
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/findmybuddies"
            activeClassName="active"
            className="hover:text-black"
          >
            Find My Buddies
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            activeClassName="active"
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
            <NavLink to="/profile">
              <div className="profile-btn reverse">
                <div className="profile-img"></div>
                <div className="username">
                  <span className="username">Username</span>
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
