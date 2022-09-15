import React, { useState } from "react";
import Button from "@mui/material/Button";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, updateUserInfo } from "../../../../store/userSlice";
import { Ngoc } from "../../../../assets";
import { buyNewCharacter } from "../../../../firebase/characters/characterServices";
import StoreItemDialog from "./StoreItemDialog";
import "./Store.scss";

const StoreItem = ({ item, userInfo }) => {
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleBuyCharacter = async () => {
    await buyNewCharacter(userInfo.uid, item.code).then((res) => {
      setMessage(res);
      setOpenSnackbar(true);
      setOpen(false);
      dispatch(updateUserInfo({ ...userInfo, gold: res[0].updatedGold }));
    });
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <ImageListItem
        key={item.photoURL}
        sx={{ border: "2px solid rgb(192, 184, 163)" }}
      >
        <img
          src={item.photoURL}
          srcSet={item.photoURL}
          alt={item.name}
          loading="lazy"
        />
        <ImageListItemBar
          className="store-text"
          title={item.name}
          subtitle={item.alias}
          actionIcon={
            <Button
              className={
                item.sold || message.code === 1
                  ? `store-text sold`
                  : `store-text`
              }
              variant="outlined"
              color="inherit"
              sx={{ mr: 3 }}
              onClick={
                item.sold || message.code === 1 ? null : () => handleOpen()
              }
            >
              <img src={Ngoc} style={{ height: "30px" }} alt="Ngoc" />
              {item.sold || message.code === 1 ? "Đã sở hữu" : item.price}
            </Button>
          }
        />
      </ImageListItem>
      <StoreItemDialog
        isOpen={isOpen}
        handleClose={handleClose}
        handleBuyCharacter={handleBuyCharacter}
        characterInfo={item}
      />
      <Snackbar
        open={openSnackbar}
        onClose={closeSnackbar}
        autoHideDuration={5000}
        message={message.message}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default StoreItem;
