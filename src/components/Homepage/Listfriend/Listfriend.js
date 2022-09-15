import React, { useState, useEffect, useRef } from "react";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import FriendHome from "./FriendHome/FriendHome";
import Newfriend from "./Newfriend/Newfriend";
import { query, collection, db, onSnapshot } from "../../../firebase";
import {
  addNewFriend,
  getFriendsByID2,
  updateFriendList,
} from "../../../firebase/friends/friendServices";
import {
  getOnlineUserByName,
  getUserByID,
} from "../../../firebase/users/userServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/userSlice";
import "./Listfriend.scss";

const Listfriend = () => {
  const [haveNewFriendBadge, setNewFriendBadge] = useState(false);
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 2 }}>
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = useState(0);
  const [Friends, setFriends] = useState([]);
  const [newFriends, setNewFriends] = useState([]);
  const [ComponentKey, setComponentKey] = useState(0);
  const userInfo = useSelector(selectUserInfo);
  useEffect(() => {
    let fetchNewFriends = async () => {
      await getFriendsByID2(userInfo.uid).then(async (res) => {
        if (res) {
          let FriendsArray = [];
          let newFriendsArray = [];
          setFriends([]);
          setNewFriends([]);
          res.forEach(async (item) => {
            let friend = await getUserByID(item.uid1);
            if (item.status === "Accepted") {
              FriendsArray.push(friend[0]);
              setFriends(FriendsArray);
            }
            if (item.status === "New") {
              newFriendsArray.push(friend[0]);
              setNewFriends(newFriendsArray);
              setNewFriendBadge(true);
            } else {
              setNewFriendBadge(false);
            }
          });
        }
      });
    };

    fetchNewFriends();
  }, [userInfo, ComponentKey]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const q = query(collection(db, "Friends"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach(() => {
        setComponentKey((ComponentKey) => ComponentKey + 1);
      });
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <div className="listfriend-form">
        <div className="listfriend-title" id="dropdownMenuLink">
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
              >
                <Tab label={<PeopleIcon />} {...a11yProps(0)} />
                <Tab
                  label={
                    haveNewFriendBadge ? (
                      <Badge color="error" variant="dot">
                        <PersonAddAlt1Icon />
                      </Badge>
                    ) : (
                      <PersonAddAlt1Icon />
                    )
                  }
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <TabPanel value={value} className="title" index={0}>
              <FriendHome Friends={Friends} />
            </TabPanel>
            <TabPanel value={value} className="title" index={1}>
              <Newfriend newFriends={newFriends} />
            </TabPanel>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Listfriend;
