import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../store/userSlice";
import { useSelector } from "react-redux";
import UserProfile from "./UserProfile/UserProfile";
import MyBattleBoard from "../Battle/MyBattleBoard/MyBattleBoard";
import {
  getNewBattle,
  getRivalProfileByMyID,
  getBattleCharacter,
  deleteBattle,
} from "../../firebase/battles/battleServices";
import { getWarriorsByCharacterID } from "../../firebase/warriors/warriorServices";
import { db, collection, query, onSnapshot, where } from "../../firebase";
import { Stack, Backdrop, CircularProgress } from "@mui/material";
import "./Battle.scss";
const Battle = () => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [character, setCharacter] = useState([]);
  const [rivalCharacter, setRivalCharacter] = useState([]);
  const [battleInfor, setBattleInfor] = useState([]);
  const [rivalProfile, setRivalProfile] = useState([]);
  const [myWarrior, setMyWarrior] = useState([]);
  const [warriorsLocation, setWarriorsLocation] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [health, setHealth] = useState(0);
  const [height, setHeight] = useState(false);
  const [readyStatus, setReadyStatus] = useState(false);
  const [readyStatusRival, setReadyStatusRival] = useState(false);
  const [seconds, setSeconds] = React.useState(300);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const getBattle = async () => {
    await getNewBattle(userInfo.uid).then((res) => {
      if (res.length === 0) {
        outBattle();
        navigate("/");
      } else {
        setBattleInfor(res[0]);
      }
    });
  };

  const getRivalProfile = async () => {
    await getRivalProfileByMyID(userInfo.uid).then((res) => {
      setRivalProfile(res[0]);
      if (res[0].rivalNumber === 1) {
        setCurrentNumber(2);
      } else {
        setCurrentNumber(1);
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
    if (battleInfor.player1.characterID && battleInfor.player2.characterID) {
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

  const getwarriorsLocation = (data) => {
    let warriorDroppedCode = data.map((item) => item.code);
    setWarriorsLocation(warriorDroppedCode);
  };

  const getHealth = (value) => {
    setHealth(value);
  };

  const getHeight = (value) => {
    setHeight(value);
  };

  const handleReadyStatus = () => {
    setReadyStatus(!readyStatus);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevProgress) => prevProgress - 1);
    }, 1000);
    if (seconds === 0) {
      outBattle();
    }
    return () => {
      clearInterval(timer);
    };
  }, [seconds]);

  useEffect(() => {
    let player1ID;
    let player2ID;
    if (rivalProfile && rivalProfile.rivalNumber === 1 && rivalProfile.uid) {
      player1ID = rivalProfile.uid;
      player2ID = userInfo.uid;
    }
    if (rivalProfile && rivalProfile.rivalNumber === 2 && rivalProfile.uid) {
      player2ID = rivalProfile.uid;
      player1ID = userInfo.uid;
    }

    if (player1ID && player2ID) {
      const q = query(
        collection(db, "Battles"),
        where("player1.uid", "==", player1ID),
        where("player2.uid", "==", player2ID)
      );
      let unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (
            (currentNumber === 2 && change.doc.data().player1.readyStatus) ||
            (currentNumber === 1 && change.doc.data().player2.readyStatus)
          ) {
            setReadyStatusRival(true);
          }
          if (
            change.doc.data().player1.readyStatus &&
            change.doc.data().player2.readyStatus
          ) {
            navigate(`/battle-playing`);
          }
        });
      });
      return unsubscribe;
    }
  }, [rivalProfile, readyStatus]);

  useEffect(() => {
    getBattle();
    getRivalProfile();
    getCharacter();
    getWarriors();
  }, [currentNumber]);

  const outBattle = async () => {
    await deleteBattle(userInfo.uid);
    navigate("/");
  };

  console.log(battleInfor.id);

  return (
    <>
      <div className="homepage-container noselect">
        <div className="battle-content">
          <Stack direction="row" spacing={2}>
            <div className="left-content">
              <UserProfile
                userInfo={userInfo}
                character={character}
                myWarrior={myWarrior}
                warriorsLocation={warriorsLocation}
                getHealth={getHealth}
                getHeight={getHeight}
                rivalProfile={rivalProfile}
                setHeight={setHeight}
                seconds={seconds}
                readyStatusRival={readyStatusRival}
                rivalCharacter={rivalCharacter}
                readyStatus={readyStatus}
              />
              <button onClick={() => outBattle()}>Thoát</button>
            </div>
            <div className="middle-content">
              <MyBattleBoard
                getwarriorsLocation={getwarriorsLocation}
                userInfo={userInfo}
                currentNumber={currentNumber}
                myWarrior={myWarrior}
                health={health}
                height={height}
                handleReadyStatus={handleReadyStatus}
                readyStatus={readyStatus}
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
    </>
  );
};

export default Battle;
