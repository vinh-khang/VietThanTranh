import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { deleteFriendInvitation } from "../../../../firebase/friends/friendServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import "./FriendHome.scss";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px #000`,
    fullwidth: "10px",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function FriendHome({ Friends }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userInfo = useSelector(selectUserInfo);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteFriend = async (uid2) => {
    await deleteFriendInvitation(uid2, userInfo.uid);
  };
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "transparent",
        display: "flex",
        mt: 2,
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          position: "relative",
          overflow: "auto",
          maxHeight: 400,
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
        {!Friends ? (
          <CircularProgress color="inherit" />
        ) : (
          Friends.map((item, index) => {
            return (
              <ListItem key={index}>
                <Stack direction="row" spacing={1} className="friend-item">
                  <Stack direction="row" spacing={2} padding={1}>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      variant="dot"
                    >
                      <Avatar alt={item.displayName} src={item.photoURL} />
                    </StyledBadge>
                  </Stack>

                  <div>
                    <div className="friend-name">
                      <b>{item.displayName}</b>
                    </div>
                    <div>Trực tuyến</div>
                  </div>
                  <MoreVertIcon
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={{ cursor: "pointer" }}
                  />
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <PermContactCalendarIcon />
                    </MenuItem>
                    <MenuItem>
                      <PersonRemoveIcon
                        onClick={() => handleDeleteFriend(item.uid)}
                      />
                    </MenuItem>
                  </Menu>
                </Stack>
              </ListItem>
            );
          })
        )}
      </List>
    </Box>
  );
}
