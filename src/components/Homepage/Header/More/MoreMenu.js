import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import "./MoreMenu.scss";

const MoreMenu = ({ open, handleClick, handleClose, logout, anchorEl }) => {
  return (
    <>
      <MenuIcon
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "#cac8c8" }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ color: "#cac8c8" }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={() => logout()}>
          <VpnKeyIcon sx={{ marginRight: 2 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default MoreMenu;
