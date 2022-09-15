import React, { useRef, useState } from "react";
import { Divider, ImageList, ListSubheader } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Avatar from "@mui/material/Avatar";
import "./SelectCharacter.scss";

export default function SelectCharacter({
  characters,
  setSelectedCharacter,
  selectedCharacter,
}) {
  const selectCharacter = (data) => {
    setSelectedCharacter(data);
  };
  return (
    <>
      <ImageList
        sx={{
          width: "100%",
          height: 380,
          marginTop: 5,
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
        cols={3}
        gap={10}
      >
        <ImageListItem key="Subheader" cols={3}>
          <ListSubheader
            component="div"
            className="inter-font select-character-title"
          >
            Thần tướng của bạn
          </ListSubheader>
          <Divider />
        </ImageListItem>

        {[...characters].map((item) => (
          <ImageListItem key={item.avatar}>
            <Avatar
              alt={item.name}
              src={item.avatar}
              variant="rounded"
              sx={{
                width: 80,
                height: 80,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              className={
                item.code === selectedCharacter.code
                  ? "character-select active"
                  : "character-select"
              }
              onClick={() => selectCharacter(item)}
            />
            <ImageListItemBar
              title={item.name}
              position="below"
              sx={{ textAlign: "center" }}
              className="sans-font bold"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
