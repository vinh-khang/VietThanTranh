import React, { useState, useEffect, useRef } from "react";
import Logo from "../../../assets/logo/logo.png";
import avatarFrame from "../../../assets/elements/circle_frame_2.png";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/userSlice";
import { removeOnlineUser } from "../../../firebase/users/userServices";
import storage from "redux-persist/lib/storage";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LinearProgress from "@mui/material/LinearProgress";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Ngoc } from "../../../assets";
import MoreMenu from "./More/MoreMenu";
import "./Header.scss";

const Header = () => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = async () => {
    await removeOnlineUser(userInfo.uid);
    storage.removeItem("persist:user");
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {});
  };

  return (
    <header className="header noselect">
      <section className="top-header">
        <nav className="navbar navbar-expand-md navbar-dark">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon "></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-around"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mb-2 mb-lg-0 player-profile">
                <img
                  src={userInfo.photoURL}
                  className="img-fluid avatar rounded-circle"
                  alt="Avatar's player"
                  draggable={false}
                />
                <img
                  src={avatarFrame}
                  className="img-fluid avatar_frame rounded-circle"
                  alt="Avatar's player"
                  draggable={false}
                />
                <div className="player-name">
                  <div className="fs-6 ">{userInfo.displayName}</div>
                  <div className="fs-6 ">
                    <i className="fa-solid fa-fire-flame-curved danger me-3 text-warning"></i>
                    Cấp {userInfo.level}
                    <LinearProgress
                      variant="determinate"
                      value={userInfo.exp}
                    />
                  </div>
                </div>
              </ul>
              <div className="logo">
                <img
                  className="img-fluid logo"
                  src={Logo}
                  alt="Generic placeholder"
                  draggable={false}
                />
              </div>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item">
                  <img src={Ngoc} style={{ height: "30px" }} alt="Ngoc" />
                  {userInfo.gold}
                </li>
                <li className="nav-item">
                  <AssignmentTurnedInIcon sx={{ color: "#cac8c8" }} />
                </li>
                <li className="nav-item">
                  <EmailIcon sx={{ color: "#cac8c8" }} />
                </li>
                <li className="nav-item">
                  <MoreMenu
                    open={open}
                    handleClick={handleClick}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    logout={logout}
                  />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
    </header>
  );
};

export default Header;
