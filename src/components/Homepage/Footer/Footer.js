import React, { useState, useEffect } from "react";
import FindBattle from "../FindBattle/FindBattle";
import { Stack, Chip } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { Inventory, Crosssword, Board, Team } from "../../../assets";
import MyTeam from "./MyTeam/MyTeam";
import Store from "./Store/Store";
import "./Footer.scss";

const Footer = () => {
  const [dialogType, setDialogType] = useState();
  const [openTeam, setOpenTeam] = useState(false);
  const [openStore, setOpenStore] = useState(false);

  const handleClickOpen = (type) => {
    setDialogType(type);
    if (type === "store") {
      setOpenStore(true);
    }
    if (type === "team") {
      setOpenTeam(true);
    }
  };

  const handleClose = () => {
    if (dialogType === "store") setOpenStore(false);
    if (dialogType === "team") setOpenTeam(false);
  };
  return (
    <footer className="footer noselect">
      <section className="footer-content">
        <div className="left-content">
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={2}
            sx={{ my: 2 }}
            className="title-stack-drawer"
          >
            <img
              className="footer-item"
              src={Board}
              onClick={() => handleClickOpen("store")}
              alt="Thần Tích"
            />
            <img
              className="footer-item"
              src={Team}
              onClick={() => handleClickOpen("team")}
              alt="Tổ đội"
            />
            <img className="footer-item" src={Crosssword} alt="Trang bị" />
            <img className="footer-item" src={Inventory} alt="Túi đồ" />
            {/* <Chip
              label="NHÂN VẬT"
              variant="outlined"
              sx={{ margin: "15px", color: "white", fontWeight: 1000 }}
            />
            <Chip
              label="THI ĐẤU CƠ BẢN 1V1"
              variant="outlined"
              sx={{ margin: "15px", color: "white", fontWeight: 1000 }}
            />
            <Chip
              label="THI ĐẤU CƠ BẢN 1V1"
              variant="outlined"
              sx={{ margin: "15px", color: "white", fontWeight: 1000 }}
            />
            <Chip
              label="THI ĐẤU CƠ BẢN 1V1"
              variant="outlined"
              sx={{ margin: "15px", color: "white", fontWeight: 1000 }}
            /> */}
          </Stack>
        </div>
        <div className="right-content">
          <FindBattle />
        </div>
      </section>
      <MyTeam isOpen={openTeam} handleClose={handleClose} />
      <Store isOpen={openStore} handleClose={handleClose} />
    </footer>
  );
};

export default Footer;
