import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import "./SearchingDrawer.scss";

export default function FoundedMatch({ isOpen, handleClose }) {
  return (
    <Dialog
      open={isOpen}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="founded-game"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ textAlign: "center" }}
      ></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
        }}
      >
        <Button
          variant="containt"
          onClick={handleClose}
          sx={{
            backgroundColor: "white",
            color: "black",
            fontWeight: 1000,
            borderRadius: "20px 20px",
          }}
        >
          <b>CHẤP NHẬN</b>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
