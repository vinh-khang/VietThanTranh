import { memo, useEffect } from "react";
import { useDrag } from "react-dnd";
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import "./Warriors.scss";
import { Stack, Badge, Chip } from "@mui/material";
const style = {
  marginRight: "1.5rem",
  float: "left",
};

export const Warrior = memo(function Box({
  health,
  type,
  warrior,
  code,
  photoURL,
  active,
  getHealth,
  readyStatus,
  setDropHeight,
}) {
  const [height, setHeight] = useState(false);

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ marginBottom: "15px" }}>
        <Chip
          avatar={
            <>
              <Avatar
                alt={warrior.name}
                src={warrior.photoURL}
                className="warrior-battle-avatar"
                variant="rounded"
              />
              <LinearScaleIcon />
            </>
          }
          data-testid="box"
          style={{ ...style }}
          label={warrior.health}
          variant="outlined"
          className={readyStatus ? "warrior-battle ready" : "warrior-battle"}
        />
      </Stack>
    </>
  );
});
