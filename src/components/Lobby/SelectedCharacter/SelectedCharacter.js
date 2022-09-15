import React, { useRef, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { Stack, Chip, Badge, Tooltip, CircularProgress } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { getWarriorsByCharacterID } from "../../../firebase/warriors/warriorServices";
import "./SelectedCharacter.scss";
import { Divider } from "@mui/material";

export default function SelectedCharacter({ selectedCharacter }) {
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

  const getAllWarriors = async () => {
    await getWarriorsByCharacterID(selectedCharacter.id).then((res) => {
      setWarriors(res);
    });
  };
  useEffect(() => {
    if (selectedCharacter.id) {
      getAllWarriors();
    }
  }, [selectedCharacter]);

  return (
    <div className="selected-characters">
      {selectedCharacter.avatar ? (
        <>
          <Stack direction="row" justifyContent="left">
            <Avatar
              alt={selectedCharacter.name}
              src={selectedCharacter.avatar}
              sx={{
                width: 80,
                height: 80,
                marginRight: 3,
                marginLeft: 3,
              }}
            />
            <div>
              <h2 className="inter-font selected-character-name">
                {selectedCharacter.name}
              </h2>
              <h4 className="inter-font selected-character-name">
                {selectedCharacter.alias}
              </h4>
            </div>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack
            direction="row"
            spacing={3}
            justifyContent="center"
            sx={{ marginTop: 2 }}
          >
            {warriors && warriors.length === 0 ? (
              <CircularProgress color="inherit" />
            ) : (
              warriors.map((item, index) => {
                return (
                  <BootstrapTooltip title={item.name} key={index}>
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
        </>
      ) : (
        <div
          className="not-select-champ"
          style={{ textAlign: "center", border: "1px dashed white" }}
        >
          BẠN CHƯA CHỌN THẦN TƯỚNG CHO MÌNH!
        </div>
      )}
    </div>
  );
}
