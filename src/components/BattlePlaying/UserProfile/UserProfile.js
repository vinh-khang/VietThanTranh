import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import { Card, Stack } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { CircularProgress, Box } from "@mui/material";
import LinearWithValueLabel from "../../Elements/LinearProgressWithLabel";
import { Warrior } from "../Warriors/Warriors";
import MiniArena from "../MiniArena/MiniArena";
import "./UserProfile.scss";

export default function UserProfile({
  userInfo,
  character,
  myWarrior,
  attackedMyLands,
  rivalProfile,
  seconds,
  allWarriorsLocations,
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
          height: 100,
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
      <LinearWithValueLabel
        maxHealth={allWarriorsLocations ? allWarriorsLocations.length : 10}
        currentHealth={3}
      />
      <MiniArena
        isMyArena={true}
        rivalProfile={rivalProfile}
        allWarriorsLocations={allWarriorsLocations}
        attackedMyLands={attackedMyLands}
      />
      <h5 className="frame-title">Quân lính của bạn</h5>
      <Stack direction="row" justifyContent="space-around">
        {myWarrior && myWarrior.length === 0 ? (
          <CircularProgress color="inherit" />
        ) : (
          myWarrior.map((item) => {
            return (
              <Avatar
                src={item.photoURL}
                sx={{ border: "2px solid white" }}
                key={item.photoURL}
              />
            );
          })
        )}
      </Stack>
    </Card>
  );
}
