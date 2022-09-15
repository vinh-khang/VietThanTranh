import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import { Card, Stack } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { red } from "@mui/material/colors";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShareIcon from "@mui/icons-material/Share";
import Chip from "@mui/material/Chip";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  ImageListItemBar,
  ImageListItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { ItemTypes } from "../DropType";
import { Warrior } from "../Warriors/Warriors";
import "./UserProfile.scss";
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function UserProfile({
  userInfo,
  character,
  myWarrior,
  warriorsLocation,
  getHealth,
  getHeight,
  rivalProfile,
  setHeight,
  seconds,
  readyStatusRival,
  rivalCharacter,
  readyStatus,
}) {
  return (
    <Card
      sx={{
        maxWidth: "100%",
        background: "transparent",
        color: "white",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={userInfo.photoURL}
          />
        }
        action={
          <Chip
            icon={<TimelapseIcon />}
            label={seconds}
            className="sans-font bold"
            sx={{
              bgcolor: "black",
              color: "white",
              marginTop: 1,
              width: 80,
            }}
          />
        }
        title={<div className="sans-font bold">{userInfo.displayName}</div>}
        subheader={
          <div className="sans-font bold white">Cấp {userInfo.level}</div>
        }
      />

      <Box
        sx={{
          flexGrow: 1,
          height: 150,
          color: "white",
        }}
        className="character-battle-img"
        style={{
          background: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 80%, rgba(0, 0, 0, 0) 0%), url(${character.longBackground}) center center no-repeat`,
        }}
      >
        <div className="char-name">{character.name}</div>
        <div className="char-alias">{character.alias}</div>
      </Box>
      <CardContent
        sx={{ float: "right", width: "50%" }}
        className="warrior-battle-container"
      >
        <h5>Quân lính của bạn</h5>
        {myWarrior && myWarrior.length === 0 ? (
          <CircularProgress color="inherit" />
        ) : (
          myWarrior.map((item, index) => {
            return (
              <Warrior
                health={item.health}
                code={item.code}
                photoURL={item.photoURL}
                type={ItemTypes.Warrior}
                key={index}
                warrior={item}
                active={warriorsLocation.includes(item.code)}
                getHealth={getHealth}
                getHeight={getHeight}
                setDropHeight={setHeight}
                readyStatus={readyStatus}
              />
            );
          })
        )}
      </CardContent>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500] }}
            aria-label="recipe"
            src={rivalProfile.photoURL}
          />
        }
        sx={{ alignItems: "center" }}
        title={<div className="sans-font bold">{rivalProfile.displayName}</div>}
        subheader={
          <>
            <div className="sans-font bold white">Cấp {rivalProfile.level}</div>
            <Divider
              variant="middle"
              sx={{ margin: "10px 0px", color: "white" }}
            />
            <div
              className={
                readyStatusRival
                  ? "rival-ready sans-font"
                  : "sans-font white bold"
              }
            >
              {readyStatusRival ? (
                <>
                  <CheckCircleIcon /> Đã sẵn sàng
                </>
              ) : (
                <>
                  <HourglassBottomIcon /> Đang dàn trận
                </>
              )}
            </div>

            {/* <ImageListItem
              key={rivalCharacter.photoURL}
              sx={{ border: "2px solid rgb(192, 184, 163)", marginTop: "30px" }}
            >
              <img
                src={rivalCharacter.longBackground}
                srcSet={rivalCharacter.longBackground}
                alt={rivalCharacter.name}
                loading="lazy"
              />
              <ImageListItemBar
                className="store-text"
                title={rivalCharacter.name}
                subtitle={rivalCharacter.alias}
              />
            </ImageListItem> */}
          </>
        }
        className="rival-battle-container"
      />
    </Card>
  );
}
