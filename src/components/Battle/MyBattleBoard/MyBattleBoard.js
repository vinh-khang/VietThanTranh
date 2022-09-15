import { memo, useCallback, useEffect, useState } from "react";
import { Stack, IconButton, Snackbar } from "@mui/material";
import BattleSquare from "../BattleSquare/BattleSquare.js";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { ItemTypes } from "../DropType.js";
import "./MyBattleBoard.scss";
import { readyForBattle } from "../../../firebase/battles/battleServices.js";
const MyBattleBoard = memo(function Container({
  getwarriorsLocation,
  userInfo,
  currentNumber,
  myWarrior,
  health,
  height,
  handleReadyStatus,
  readyStatus,
}) {
  let battleSquare = Array(169).fill({
    accepts: [ItemTypes.Warrior],
    lastDroppedItem: null,
  });
  const [dustbin, setDustbins] = useState(battleSquare);
  const [warriorsLocation, setwarriorsLocation] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [dropHover, setDropHover] = useState([]);
  const [dropHoverError, setDropHoverError] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
  let rowLimit = [12, 25, 38, 51, 64, 77, 90, 103, 116, 129, 142, 155, 168];
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

  const handleDrop = useCallback((count, item) => {
    let same = [];
    let limit = [];
    warriorsLocation.forEach((warrior, index) => {
      if (!item.height) {
        for (let i = 0; i < item.health; i++) {
          if (warrior.location.includes(count + i)) {
            same.push(count + i);
          }
        }
      } else {
        for (let i = 0; i < item.health; i++) {
          if (warrior.location.includes(count + i * 13)) {
            same.push(count + i * 13);
          }
        }
      }
    });
    if (!item.height) {
      for (let i = 0; i < item.health; i++) {
        rowLimit.map((item) => {
          if (item === count + i && !limit.includes(count + i))
            limit.push(count + i);
          else if (item + 1 === count + i && !limit.includes(count + i))
            limit.push(count + i);
        });
      }
    } else {
      if (count + item.health * 13 - 13 > 168) limit.push(count, count);
    }

    if (same.length > 0 || limit.length > 1) {
      setSnackbarMessage("Không thể đặt quân tại vị trí này");
      setOpenSnackbar(true);
    } else {
      let location = [];
      if (!item.height) {
        for (let i = 0; i < item.health; i++) {
          location.push(count + i);
          dustbin[count + i] = {
            accepts: [ItemTypes.Warrior],
            lastDroppedItem: item,
          };

          setDustbins(dustbin);
        }
      } else {
        for (let i = 0; i < item.health; i++) {
          location.push(count + i * 13);
          dustbin[count + i * 13] = {
            accepts: [ItemTypes.Warrior],
            lastDroppedItem: item,
          };

          setDustbins(dustbin);
        }
      }
      if (warriorsLocation.length === 0) {
        setwarriorsLocation(() => [
          ...warriorsLocation,
          { code: item.code, location: location },
        ]);
      } else {
        warriorsLocation.forEach(
          (warrior, index) => {
            if (warrior.code && warrior.code === item.code) {
              let newUpdatedWarriorsLocation = warriorsLocation;
              newUpdatedWarriorsLocation.splice(index, 1);
              setwarriorsLocation([
                ...newUpdatedWarriorsLocation,
                { code: item.code, location: location },
              ]);
            } else {
              setwarriorsLocation(() => [
                ...warriorsLocation,
                { code: item.code, location: location },
              ]);
            }
          },
          [warriorsLocation, allLocations]
        );
      }
    }
  });

  useEffect(() => {
    myWarrior.map((item, index) => {
      dustbin[0] = {
        accepts: [ItemTypes.Warrior],
        lastDroppedItem: item,
      };
      setwarriorsLocation(() => [
        ...warriorsLocation,
        { code: item.code, location: index },
      ]);
    });
    setDustbins(dustbin);
  }, []);

  useEffect(() => {
    let demo = [];
    warriorsLocation.map((item) => {
      demo.push(...item.location);
    });
    setAllLocations(demo);
    getwarriorsLocation(warriorsLocation);
  }, [warriorsLocation]);

  const handleDropHover = (key) => {
    let dropHover = [];
    let dropHoverError = [];
    let same = [];
    let limit = [];
    if (key !== -1) {
      warriorsLocation.forEach((warrior, index) => {
        if (!height) {
          for (let i = 0; i < health; i++) {
            if (warrior.location.includes(key + i)) {
              same.push(key + i);
            }
          }
        } else {
          for (let i = 0; i < health; i++) {
            if (warrior.location.includes(key + i * 13)) {
              same.push(key + i * 13);
            }
          }
        }
      });
      if (!height) {
        for (let i = 0; i < health; i++) {
          rowLimit.map((item) => {
            if (item === key + i && !limit.includes(key + i))
              limit.push(key + i);
            else if (item + 1 === key + i && !limit.includes(key + i))
              limit.push(key + i);
          });
        }
      } else {
        if (key + health * 13 - 13 > 168) limit.push(key, key);
      }

      if (limit.length > 1) {
        if (!height) {
          for (let i = 0; i < limit[1] - key; i++) {
            dropHoverError.push(key + i);
          }
        } else {
          for (let i = 0; i < health; i++) {
            dropHoverError.push(key + i * 13);
          }
        }
      } else if (same.length > 0) {
        if (!height) {
          for (let i = 0; i < health; i++) {
            dropHoverError.push(key + i);
          }
        } else {
          for (let i = 0; i < health; i++) {
            dropHoverError.push(key + i * 13);
          }
        }
      } else {
        if (!height) {
          for (let i = 0; i < health; i++) {
            dropHover.push(key + i);
          }
        } else {
          for (let i = 0; i < health; i++) {
            dropHover.push(key + i * 13);
          }
        }
      }
    }
    setDropHoverError(dropHoverError);
    setDropHover(dropHover);
  };

  const Ready = () => {
    if (
      warriorsLocation.length > 0 &&
      warriorsLocation.length === myWarrior.length
    ) {
      readyForBattle(userInfo.uid, warriorsLocation, currentNumber);
      handleReadyStatus(true);
    } else {
      setSnackbarMessage("Chưa dàn trận đủ đội hình!");
      setOpenSnackbar(true);
    }
  };

  return (
    <Stack direction="row" className="my-battle-board-container">
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
        <h4 className="board-title">Triển khai đội quân</h4>
        <Stack direction="row" className="inter-font">
          {columnName.map((name) => (
            <div className="board-column-name" key={name}>
              {name}
            </div>
          ))}
        </Stack>
        <div className="board-container">
          {dustbin.map(({ accepts, lastDroppedItem }, index) => (
            <BattleSquare
              accept={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={(item) => handleDrop(index, item)}
              value={index}
              key={index}
              handleDropHover={handleDropHover}
              dropHover={dropHover.includes(index)}
              dropHoverError={dropHoverError.includes(index)}
              active={allLocations.includes(index)}
            />
          ))}
        </div>
      </div>
      <div className="right-board-content">
        <div className="board-guide"></div>
        <Button
          variant="contained"
          onClick={() => Ready()}
          className="ready-board-btn"
        >
          {readyStatus ? "Đã sẵn sàng!" : "Sẵn sàng!"}
        </Button>
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

export default MyBattleBoard;
