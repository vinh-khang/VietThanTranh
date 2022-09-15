import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { getAllCharacters } from "../../../../firebase/characters/characterServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import { Ngoc } from "../../../../assets";
import "./Store.scss";

const StoreItemDialog = ({
  isOpen,
  handleClose,
  handleBuyCharacter,
  characterInfo,
}) => {
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        className="noselect"
      >
        <DialogTitle
          id="alert-dialog-title"
          className="store-item-dialog sans-font"
        >
          <b>{"XÁC NHẬN CHIÊU MỘ THẦN TƯỚNG"}</b>
        </DialogTitle>
        <DialogContent className="store-item-dialog sans-font">
          <span>Bạn có chắc chắn muốn chiêu mộ </span>
          <span className="blue bold">{characterInfo.name}</span> vào đội hình
          của mình với giá{" "}
          <span className="blue bold">{characterInfo.price} Linh Châu</span>{" "}
          không?`
        </DialogContent>
        <DialogActions className="store-item-dialog">
          <Button
            onClick={handleClose}
            variant="outlined"
            color="inherit"
            className="sans-font bold"
          >
            Hủy
          </Button>
          <Button
            onClick={handleBuyCharacter}
            variant="outlined"
            color="inherit"
            className="sans-font bold"
            autoFocus
          >
            XÁC NHẬN
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StoreItemDialog;
