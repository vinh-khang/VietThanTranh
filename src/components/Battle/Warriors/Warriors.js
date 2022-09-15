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
  let [{ opacity, borderRadius }, drag] = useDrag(() => {
    return {
      type,
      item: { height, health, code, photoURL },
      collect: (monitor) => {
        monitor.isDragging() && getHealth(health);
        monitor.isDragging() && setDropHeight(height);
        return {
          opacity: monitor.isDragging() ? 0.4 : 1,
        };
      },
    };
  }, [health, type, height, code, photoURL]);

  const changeHeight = () => {
    setHeight(!height);
  };

  if (readyStatus) drag = null;
  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ marginBottom: "15px" }}>
        <Chip
          avatar={
            <>
              <Avatar
                alt={warrior.name}
                src={warrior.photoURL}
                ref={drag}
                className="warrior-battle-avatar"
                style={{ borderRadius }}
                variant="rounded"
              />
              <LinearScaleIcon />
            </>
          }
          onClick={() => changeHeight()}
          data-testid="box"
          style={{ ...style, opacity }}
          label={warrior.health}
          variant="outlined"
          onDelete={() => changeHeight()}
          deleteIcon={
            !height ? (
              <KeyboardDoubleArrowRightIcon className="warrior-battle-icon" />
            ) : (
              <KeyboardDoubleArrowDownIcon className="warrior-battle-icon" />
            )
          }
          className={readyStatus ? "warrior-battle ready" : "warrior-battle"}
        />
        {active && <CheckCircleIcon />}
      </Stack>
    </>
  );
});
