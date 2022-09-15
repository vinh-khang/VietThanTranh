import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, DialogTitle } from "@mui/material";
import CharInfo from "./CharInfo";
import { getCharactersByUID } from "../../../../firebase/characters/characterServices";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import "./MyTeam.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
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

const MyTeam = ({ isOpen, handleClose }) => {
  const [value, setValue] = useState(0);
  const [characters, setCharacters] = useState([]);
  const [urlBG, setUrlBG] = useState("");
  let userInfo = useSelector(selectUserInfo);

  const getCharacters = async () => {
    await getCharactersByUID(userInfo.uid).then((res) => {
      setCharacters(res);
      if (!urlBG) {
        setUrlBG(res[0].photoURL);
      }
    });
  };

  useEffect(() => {
    getCharacters();
  }, [isOpen, urlBG]);

  const styles = () => ({
    indicator: {
      backgroundColor: "white",
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateBackground = (url) => {
    setUrlBG(url);
  };

  return (
    <Dialog
      maxWidth="lg"
      open={isOpen}
      onClose={handleClose}
      className="my-team-container noselect"
    >
      <AppBar sx={{ position: "relative" }} className="my-team-bar">
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component={"div"}>
            THẦN TƯỚNG CỦA TÔI
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
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          height: 224,
          color: "white",
        }}
        className="my-team-content"
        style={{
          background: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0) 0%), url(${urlBG}) center center no-repeat`,
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ borderRight: 1, borderColor: "divider", wdith: 300 }}
          classes={{
            indicator: styles.indicator,
          }}
        >
          {characters &&
            characters.map((item, index) => {
              return (
                <Tab
                  label={
                    <Avatar
                      alt="Remy Sharp"
                      src={item.avatar}
                      draggable={false}
                    />
                  }
                  onClick={() => updateBackground(item.photoURL)}
                  key={index}
                />
              );
            })}
        </Tabs>
        {characters &&
          characters.map((item, index) => {
            return (
              <TabPanel value={value} index={index} key={index}>
                <CharInfo character={item} />
              </TabPanel>
            );
          })}
      </Box>
    </Dialog>
  );
};

export default MyTeam;
