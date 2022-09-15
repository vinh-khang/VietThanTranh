import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import "./TurnDialog.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TurnDialog({ open, name }) {
  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        className="turn-dialog-bg"
      >
        <DialogContent className="turn-dialog">
          <DialogContentText
            id="alert-dialog-slide-description"
            className="turn-dialog turn-dialog-title inter-font"
          >
            LƯỢT CỦA {name}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
