import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../store/userSlice";
import { useSelector } from "react-redux";
import {
  db,
  collection,
  query,
  onSnapshot,
  where,
  documentId,
} from "../../firebase";
import { Stack, Backdrop, CircularProgress, Snackbar } from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import {
  getNewBattle,
  getRivalProfileByMyID,
  getBattleCharacter,
  deleteBattle,
  getBattleWarriors,
  updateAttackedEnemyLands,
  updateLastTurn,
  updateCurrentTurn,
} from "../../firebase/battles/battleServices";
import { getWarriorsByCharacterID } from "../../firebase/warriors/warriorServices";
import UserProfile from "./UserProfile/UserProfile";
import EnemyBoard from "./EnemyBoard/EnemyBoard";
import TurnDialog from "./TurnDialog/TurnDialog";
import { randomIntFromInterval } from "../../utils/common";
import "./BattlePlaying.scss";

const BattlePlaying = () => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [character, setCharacter] = useState([]);
  const [rivalCharacter, setRivalCharacter] = useState([]);
  const [battleInfor, setBattleInfor] = useState([]);
  const [rivalProfile, setRivalProfile] = useState([]);
  const [myWarrior, setMyWarrior] = useState([]);
  const [warriorsLocation, setWarriorsLocation] = useState([]);
  const [enemyWarriorsLocation, setEnemyWarriorsLocation] = useState([]);
  const [allWarriorsLocations, setAllWarriorsLocations] = useState([]);
  const [allEnemyWarriorsLocations, setAllEnemyWarriorsLocations] = useState(
    []
  );
  const [currentNumber, setCurrentNumber] = useState(0);
  const [seconds, setSeconds] = React.useState(300);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [attackedEnemyLands, setAttackedEnemyLands] = useState([]);
  const [attackedMyLands, setAttackedMyLands] = useState([]);
  const [openTurnDialog, setOpenTurnDialog] = useState(false);
  const [openAttackSnackbar, setOpenAttackSnackbar] = useState(false);
  // const [lastTurn, setLastTurn] = useState(0);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isAwaitTurn, setIsAwaitTurn] = useState(false);

  useEffect(() => {
    handleGetNewBattle();
    getRivalProfile();
    getCharacter();
    getWarriors();
    handleGetwarriorsLocation();
    const currentTurn = randomIntFromInterval(1, 2);
    setCurrentTurn(currentTurn);
    updateCurrentTurn(battleInfor.id, currentTurn);
  }, [currentNumber]);

  const handleGetNewBattle = async () => {
    userInfo.uid &&
      (await getNewBattle(userInfo.uid).then((data) => {
        if (data.length === 0) {
          // outBattle();
          // navigate("/");
        } else {
          setBattleInfor(data[0]);
        }
      }));
  };

  const getRivalProfile = async () => {
    await getRivalProfileByMyID(userInfo.uid).then((res) => {
      if (res[0]) {
        setRivalProfile(res[0]);
        if (res[0].rivalNumber === 1) {
          setCurrentNumber(2);
        } else {
          setCurrentNumber(1);
        }
        if (res[0].rivalNumber !== currentTurn) {
          setIsMyTurn(true);
        }
        setTimeout(() => {
          setOpenTurnDialog(true);
        }, 500);
      }
    });
  };

  const getCharacter = async () => {
    await getBattleCharacter(battleInfor, currentNumber).then((res) => {
      res && setCharacter(res[0]);
    });
    await getBattleCharacter(battleInfor, rivalProfile.rivalNumber).then(
      (res) => {
        res && setRivalCharacter(res[0]);
      }
    );
  };

  const getWarriors = async () => {
    if (
      battleInfor.player1 &&
      battleInfor.player2 &&
      battleInfor.player1.characterID &&
      battleInfor.player2.characterID
    ) {
      if (currentNumber === 1) {
        await getWarriorsByCharacterID(battleInfor.player1.characterID).then(
          (res) => {
            setMyWarrior(res);
          }
        );
      } else {
        await getWarriorsByCharacterID(battleInfor.player2.characterID).then(
          (res) => {
            setMyWarrior(res);
          }
        );
      }
      setOpenBackdrop(false);
    }
  };

  const handleGetwarriorsLocation = async () => {
    await getBattleWarriors(userInfo, currentNumber).then((res) => {
      res && setWarriorsLocation(res);
      let allWarriorLocationsTemp = [];
      res &&
        res.forEach((item) => allWarriorLocationsTemp.push(...item.location));
      setAllWarriorsLocations(allWarriorLocationsTemp);
    });
    await getBattleWarriors(rivalProfile, rivalProfile.rivalNumber).then(
      (res) => {
        res && setEnemyWarriorsLocation(res);
        let allEWarriorLocationsTemp = [];
        res &&
          res.forEach((item) =>
            allEWarriorLocationsTemp.push(...item.location)
          );
        setAllEnemyWarriorsLocations(allEWarriorLocationsTemp);
      }
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevProgress) => prevProgress - 1);
    }, 1000);
    if (seconds === 0) {
      //   outBattle();
    }
    return () => {
      clearInterval(timer);
    };
  }, [seconds]);

  useEffect(() => {
    if (battleInfor.id) {
      const q = query(
        collection(db, "Battles"),
        where(documentId(), "==", battleInfor.id)
      );
      let unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let data = change.doc.data();
          if (currentNumber === 1) {
            setAttackedEnemyLands(data.player1.attackedEnemyLands);
            setAttackedMyLands(data.player2.attackedEnemyLands);
          } else {
            setAttackedEnemyLands(data.player2.attackedEnemyLands);
            setAttackedMyLands(data.player1.attackedEnemyLands);
          }
          if (data.currentTurn === currentNumber) {
            setOpenAttackSnackbar(true);
            setIsMyTurn(true);
          } else {
            setIsMyTurn(false);
          }

          setTimeout(() => {
            setIsAwaitTurn(data.currentTurn === currentNumber);
            if (data.currentTurn !== data.lastTurn) {
              setOpenTurnDialog(true);
            }
            setOpenAttackSnackbar(false);
            setTimeout(() => {
              setSeconds(300);
              setOpenTurnDialog(false);
            }, 2000);
          }, 3000);
        });
      });
      return unsubscribe;
    }
  }, [rivalProfile]);

  const outBattle = async () => {
    await deleteBattle(userInfo.uid);
    navigate("/");
  };

  const hitArenaLand = (lands, hitValue) => {
    return lands.includes(hitValue);
  };

  const attackArenaLand = async (value) => {
    if (isMyTurn) {
      setAttackedEnemyLands((attackedEnemyLands) => [
        ...attackedEnemyLands,
        value,
      ]);

      await updateAttackedEnemyLands(battleInfor.id, currentNumber, [
        ...attackedEnemyLands,
        value,
      ]);

      await updateLastTurn(battleInfor.id, currentNumber);
      if (hitArenaLand(allEnemyWarriorsLocations, value)) {
        await updateCurrentTurn(battleInfor.id, currentNumber);
      } else {
        await updateCurrentTurn(battleInfor.id, rivalProfile.rivalNumber);
      }
    }

    // if (!hitArenaLand(allEnemyWarriorsLocations, value)) {
    //   setTimeout(() => {
    //     setOpenTurnDialog(true);
    //   }, 3000);
    // }
  };

  return (
    <>
      <div className="homepage-container noselect">
        <div className="battle-playing-content">
          <Stack direction="row" spacing={2}>
            <div className="left-content">
              <h2>{currentNumber}</h2>
              <UserProfile
                userInfo={userInfo}
                character={character}
                myWarrior={myWarrior}
                warriorsLocation={warriorsLocation}
                seconds={seconds}
                allWarriorsLocations={allWarriorsLocations}
                attackedMyLands={attackedMyLands}
                isMyTurn={isMyTurn}
              />
            </div>
            <div className="middle-content">
              <EnemyBoard
                rivalProfile={rivalProfile}
                attackArenaLand={attackArenaLand}
                isMyTurn={isMyTurn}
                isAwaitTurn={isAwaitTurn}
                attackedEnemyLands={
                  isAwaitTurn ? attackedEnemyLands : attackedMyLands
                }
                allEnemyWarriorsLocations={
                  isAwaitTurn ? allEnemyWarriorsLocations : allWarriorsLocations
                }
              />
            </div>
          </Stack>
        </div>
      </div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "black",
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TurnDialog open={openTurnDialog} name={isMyTurn ? "BẠN" : "ĐỐI THỦ"} />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAttackSnackbar}
        autoHideDuration={2000}
        message={
          !isAwaitTurn ? (
            <span>
              <TrackChangesIcon /> ĐỐI THỦ ĐÃ TẤN CÔNG 1 MỤC TIÊU
            </span>
          ) : (
            <span>
              <TrackChangesIcon /> BẠN ĐÃ TẤN CÔNG 1 MỤC TIÊU
            </span>
          )
        }
      />
    </>
  );
};

export default BattlePlaying;
