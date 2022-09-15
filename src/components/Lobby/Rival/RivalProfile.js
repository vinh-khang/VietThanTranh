import React, { useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./RivalProfile.scss";
import { Divider, Stack } from "@mui/material";

export default function RivalProfile({ rivalProfile }) {
  return (
    <>
      <Stack
        direction="row"
        className="selected-characters"
        justifyContent="left"
      >
        <Avatar
          alt={rivalProfile.displayName}
          src={rivalProfile.photoURL}
          sx={{
            width: 80,
            height: 80,
            marginRight: 3,
            marginLeft: 3,
          }}
        />
        <div>
          <h2 className="inter-font selected-character-name">
            {rivalProfile.displayName}
          </h2>
          <Divider />
          <h4 className="inter-font selected-character-name">
            Cấp {rivalProfile.level}
          </h4>
        </div>
      </Stack>
    </>
  );
}
