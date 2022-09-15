import { memo, useCallback, useEffect, useState } from "react";
import { Stack, IconButton, Snackbar } from "@mui/material";
import BattleSquare from "../BattleSquare/BattleSquare.js";
import { Avatar, CardHeader, Divider } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearWithValueLabel from "../../Elements/LinearProgressWithLabel.js";
import MiniArena from "../MiniArena/MiniArena.js";
import "./EnemyBoard.scss";
const EnemyBoard = memo(function Container({
  rivalProfile,
  attackArenaLand,
  isMyTurn,
  isAwaitTurn,
  attackedEnemyLands,
  allEnemyWarriorsLocations,
}) {
  let initBattleLands = Array(169).fill({
    lastDroppedItem: null,
  });
  const [battleLands, setBattleLands] = useState(initBattleLands);
  const [warriorsLocation, setwarriorsLocation] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [lands, setAllLands] = useState([]);
  const [lands2, setAllLands2] = useState([]);
  let columnName = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "K",
    "L",
    "M",
    "N",
  ];
  let rowName = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };
  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={closeSnackbar}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );

  useEffect(() => {
    let locations = [];
    warriorsLocation.map((item) => {
      locations.push(...item.location);
    });
    setAllLocations(locations);
  }, [warriorsLocation]);

  return (
    <Stack direction="row" className="playing-battle-board-container">
      <Stack
        direction="column"
        gap={2.6}
        sx={{ marginTop: 12 }}
        className="inter-font"
      >
        {rowName.map((name) => (
          <div className="board-row-name" key={name}>
            {name}
          </div>
        ))}
      </Stack>
      <div
        style={{ overflow: "hidden", clear: "both" }}
        className="left-board-content"
      >
        <h4 className="board-title">
          {isAwaitTurn ? "LƯỢT CỦA BẠN" : "LƯỢT CỦA ĐỐI THỦ"}
        </h4>
        <Stack direction="row" className="inter-font board-column-name">
          {columnName.map((name) => (
            <div className="board-column-name-item" key={name}>
              {name}
            </div>
          ))}
        </Stack>
        <div className="board-container">
          {battleLands.map(({ lastDroppedItem }, index) => (
            <BattleSquare
              value={index}
              key={index}
              active={allEnemyWarriorsLocations.includes(index)}
              attackArenaLand={attackArenaLand}
              attacked={attackedEnemyLands.includes(index)}
              isMyTurn={isMyTurn}
            />
          ))}
        </div>
      </div>
      <div className="right-board-content">
        <div className="board-guide">
          <MiniArena
            rivalProfile={rivalProfile}
            allWarriorsLocations={allEnemyWarriorsLocations}
            attackedMyLands={attackedEnemyLands}
            isMyTurn={isMyTurn}
            isMyArena={false}
          />
        </div>
        <CardHeader
          className="battle-playing-rival-container"
          avatar={<Avatar aria-label="recipe" src={rivalProfile.photoURL} />}
          sx={{ alignItems: "center" }}
          title={
            <div className="sans-font bold">{rivalProfile.displayName}</div>
          }
          subheader={
            <>
              <div className="sans-font bold white">
                Cấp {rivalProfile.level}
              </div>
              <Divider
                variant="middle"
                sx={{ margin: "10px 0px", color: "white" }}
              />
              <LinearWithValueLabel />
            </>
          }
        />
      </div>
      <Snackbar
        open={openSnackbar}
        onClose={closeSnackbar}
        autoHideDuration={5000}
        message={snackbarMessage}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Stack>
  );
});

export default EnemyBoard;
