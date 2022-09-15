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
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import "./MyTeam.scss";
import { Stack, Chip, Badge, Tooltip, CircularProgress } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { getWarriorsByCharacterID } from "../../../../firebase/warriors/warriorServices";

const CharInfo = ({ character }) => {
  const [warriors, setWarriors] = useState([]);
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    backgroundColor: "transparent",
    color: "white",
    fontFamily: "SVN-Internation, serif !important",
    textShadow: "1px 1px #000",
  }));
  const BootstrapTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
  }));

  useEffect(() => {
    let getWarriors = () => {
      getWarriorsByCharacterID(character.id).then((res) => {
        if (res) {
          setWarriors(res);
        }
      });
    };

    getWarriors();
  }, []);
  return (
    <div className="char-info-container">
      <Stack direction="row">
        <div className="char-info-left">
          <div className="char-name">{character.name}</div>
          <div className="char-alias">{character.alias}</div>
          <div className="char-summary">{character.description}</div>
          <Divider sx={{ my: 2 }} />
          <div className="">QUÂN LÍNH</div>
          <Stack direction="row" spacing={3}>
            {warriors.length === 0 ? (
              <CircularProgress color="inherit" />
            ) : (
              warriors.map((item) => {
                return (
                  <BootstrapTooltip title={item.name}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      badgeContent={<SmallAvatar>{item.health}</SmallAvatar>}
                    >
                      <Avatar
                        variant="rounded"
                        className="char-team"
                        src={item.photoURL}
                      />
                    </Badge>
                  </BootstrapTooltip>
                );
              })
            )}
          </Stack>

          <Chip
            label="ĐÃ MỞ KHÓA"
            icon={<LockOpenIcon />}
            variant="outlined"
            sx={{
              margin: "30px",
              color: "white",
              fontWeight: 1000,
              padding: "15px",
            }}
          />
        </div>
        <div className="char-info-right">
          {/* <img src={thuytinhCard} className="char-card" draggable={false} /> */}
        </div>
      </Stack>
    </div>
  );
};

export default CharInfo;
