import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import {
  addNewFriend,
  acceptNewFriend,
  deleteFriendInvitation,
} from "../../../../firebase/friends/friendServices";
import { getOnlineUserByName } from "../../../../firebase/users/userServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import "./Newfriend.scss";

const Newfriend = ({ newFriends }) => {
  const [friendName, setFriendName] = useState("");
  const [message, setMesssage] = useState("");
  const [haveMessage, setHaveMesssage] = useState(false);
  const userInfo = useSelector(selectUserInfo);

  const searchFriend = (e) => {
    setFriendName(e.target.value);
  };

  const addFriend = async () => {
    setFriendName("");
    const userAdding = await getOnlineUserByName(friendName);
    if (userAdding[0].uid) {
      let response = await addNewFriend({
        uid1: userInfo.uid,
        uid2: userAdding[0].uid,
        status: "New",
      });

      if (response) {
        setMesssage(response.message);
        setHaveMesssage(true);
      }
    }
  };

  const acceptFriend = async (uid1) => {
    await acceptNewFriend(uid1, userInfo.uid);
  };

  const handleDeleteFriend = async (uid2) => {
    await deleteFriendInvitation(userInfo.uid, uid2);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setHaveMesssage(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Paper
        component="form"
        className="search-friend"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          mt: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          className="search-input"
          placeholder="Nhập tên người chơi"
          inputProps={{ "aria-label": "search google maps" }}
          value={friendName}
          onChange={(e) => searchFriend(e)}
        />
        <IconButton
          sx={{ p: "5px" }}
          aria-label="search"
          onClick={() => addFriend()}
        >
          <PersonAddAlt1Icon className="search-input" />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      <br />

      <b>Lời mời kết bạn mới</b>
      <br />
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          position: "relative",
          overflow: "auto",
          maxHeight: 300,
          "& ul": { padding: 0 },
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
      >
        {!newFriends ? (
          <CircularProgress color="inherit" />
        ) : (
          newFriends.map((item) => (
            <>
              <ListItem key={`item-${item}`}>
                <Stack direction="row" spacing={2} className="friend-item">
                  <Stack direction="row" spacing={2} padding={1}>
                    <Avatar alt="Remy Sharp" src={item.photoURL} />
                  </Stack>
                  <div>
                    <div>
                      <b>{item.displayName}</b>
                    </div>
                    <div>
                      <IconButton
                        aria-label="delete"
                        onClick={() => acceptFriend(item.uid)}
                      >
                        <TaskAltIcon sx={{ color: "#8fe88f" }} />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteFriend(item.uid)}
                      >
                        <HighlightOffIcon sx={{ color: "#ff4a4a" }} />
                      </IconButton>
                    </div>
                  </div>
                </Stack>
              </ListItem>
            </>
          ))
        )}
      </List>
      <Snackbar
        open={haveMessage}
        onClose={handleClose}
        autoHideDuration={3500}
        message={message}
        action={action}
      />
    </div>
  );
};

export default Newfriend;
