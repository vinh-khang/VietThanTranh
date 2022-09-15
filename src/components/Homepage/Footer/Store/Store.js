import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import {
  getAllCharacters,
  getCharactersByUID,
} from "../../../../firebase/characters/characterServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import { Ngoc } from "../../../../assets";
import "./Store.scss";
import StoreItem from "./StoreItem";

const Store = ({ isOpen, handleClose }) => {
  const [scroll] = useState("paper");
  const [characters, setCharacters] = useState([]);
  const [ownCharacters, setOwnCharacters] = useState([]);
  const userInfo = useSelector(selectUserInfo);
  const descriptionElementRef = React.useRef(null);
  useEffect(() => {
    if (isOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isOpen]);
  const getCharacters = async () => {
    await getAllCharacters(userInfo.uid).then((res2) => {
      setCharacters(res2);
    });
  };

  useEffect(() => {
    getCharacters();
  }, [isOpen]);

  return (
    <Dialog
      maxWidth="lg"
      open={isOpen}
      onClose={handleClose}
      className="store-container noselect"
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <AppBar sx={{ position: "relative" }} className="store-bar">
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="span">
            CỬA HÀNG VỆ THẦN
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent
        dividers={scroll === "paper"}
        className="store-content"
        id="scroll-dialog-description"
        ref={descriptionElementRef}
        tabIndex={-1}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            height: 224,
            color: "white",
          }}
        >
          <ImageList
            sx={{
              width: 1200,
              height: 560,
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
                webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,.1)",
                outline: "1px solid slategrey",
              },
            }}
            cols={2}
            gap={30}
          >
            {characters.length > 0 ? (
              characters.map((item, index) => {
                return (
                  <StoreItem item={item} userInfo={userInfo} key={index} />
                );
              })
            ) : (
              <CircularProgress color="inherit" />
            )}
          </ImageList>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Store;
