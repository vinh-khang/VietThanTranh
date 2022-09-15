import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../store/userSlice";
import { useSelector } from "react-redux";
import {
  getNewLobby,
  deleteLobby,
  getRivalProfileByMyID,
  readyForMatch,
} from "../../firebase/matches/matchServices";
import { addBattle } from "../../firebase/battles/battleServices";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import SelectedCharacter from "./SelectedCharacter/SelectedCharacter";
import PlayerProfile from "./PlayerProfile/PlayerProfile";
import SelectCharacter from "./SelectCharacter/SelectCharacter";
import RivalProfile from "./Rival/RivalProfile";
import LobbyChat from "./LobbyChat/LobbyChat";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getCharactersByUID } from "../../firebase/characters/characterServices";
import Chip from "@mui/material/Chip";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import { Ready } from "../../assets";
import "./Lobby.scss";
import {
  Stack,
  IconButton,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { db, collection, query, onSnapshot, where } from "../../firebase";

const Lobby = () => {
  const userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [lobbyInfor, setLobbyInfor] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState([]);
  const [rivalProfile, setRivalProfile] = useState([]);
  const [readyStatus, setReadyStatus] = useState(false);
  const [matchMessage, setMatchMessage] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [openBackdrop, setOpenBackdrop] = useState(true);

  const getLobby = async () => {
    await getNewLobby(userInfo.uid).then((res) => {
      if (res.length === 0) {
        navigate("/");
      } else {
        setLobbyInfor(res[0]);
      }
    });
  };

  const getCharacters = async () => {
    await getCharactersByUID(userInfo.uid).then((res) => {
      setCharacters(res);
    });
  };

  const getRivalProfile = async () => {
    await getRivalProfileByMyID(userInfo.uid).then((res) => {
      setRivalProfile(res[0]);
      setOpenBackdrop(false);
    });
  };

  useEffect(() => {
    getLobby();
    getRivalProfile();
    getCharacters();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevProgress) => prevProgress - 1);
    }, 1000);
    if (seconds === 0) {
      outLobby();
    }
    return () => {
      clearInterval(timer);
    };
  }, [seconds]);

  useEffect(() => {
    let player1ID;
    let player2ID;
    if (rivalProfile.rivalNumber === 1 && rivalProfile.uid) {
      player1ID = rivalProfile.uid;
      player2ID = userInfo.uid;
    }
    if (rivalProfile.rivalNumber === 2 && rivalProfile.uid) {
      player2ID = rivalProfile.uid;
      player1ID = userInfo.uid;
    }

    if (player1ID && player2ID) {
      const q = query(
        collection(db, "Lobby"),
        where("player1.uid", "==", player1ID),
        where("player2.uid", "==", player2ID)
      );
      let unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (
            change.doc.data().player1.readyStatus &&
            change.doc.data().player2.readyStatus
          ) {
            if (change.doc.data().player1.uid == userInfo.uid) {
              await addBattle(change.doc.data());
            }
            deleteLobby(userInfo.uid);
            setTimeout(() => navigate(`/battle`), 500);
          } else if (change.type === "removed") {
            outLobby();
          }
        });
      });
      return unsubscribe;
    }
  }, [rivalProfile, readyStatus]);

  const outLobby = async () => {
    await deleteLobby(userInfo.uid);
    navigate("/");
  };

  const handleReadyStatus = async () => {
    if (selectedCharacter.id) {
      setReadyStatus(true);
      if (rivalProfile.rivalNumber === 1 && selectedCharacter.id) {
        await readyForMatch(userInfo.uid, selectedCharacter.id, 2);
      }
      if (rivalProfile.rivalNumber === 2) {
        await readyForMatch(userInfo.uid, selectedCharacter.id, 1);
      }
    } else {
      setMatchMessage({
        code: 1,
        text: "Bạn chưa chọn Thần Tướng cho mình!",
      });
      setOpenSnackbar(true);
    }
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <div className="homepage-container noselect">
        <div className="waiting-battle-content">
          <div className="main-content">
            <div className="left-content">
              <div className="title inter-font">
                <i className="fa-solid fa-user-shield me-2"></i> CHỌN ANH HÙNG
                CHO BẠN
              </div>
              <div className="hero-selection">
                <SelectedCharacter selectedCharacter={selectedCharacter} />
                <SelectCharacter
                  characters={characters}
                  setSelectedCharacter={setSelectedCharacter}
                  selectedCharacter={selectedCharacter}
                />
              </div>
            </div>
            <div className="middle-content">
              <div className="text-center mid-title"></div>
              <PlayerProfile userInfo={userInfo} />

              <Stack
                direction="row"
                justifyContent="center"
                className="ready-lobby"
              >
                <Chip
                  icon={<HighlightOffIcon />}
                  className="sans-font bold out-lobby"
                  onClick={outLobby}
                  label="Hủy"
                  sx={{
                    bgcolor: "black",
                    color: "white",
                    marginTop: 1,
                    width: 80,
                  }}
                />
                <img
                  src={Ready}
                  className={
                    readyStatus
                      ? "ready-lobby-btn ready-status"
                      : "ready-lobby-btn"
                  }
                  style={{ width: "250px" }}
                  alt="..."
                  onClick={() => handleReadyStatus()}
                />
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
              </Stack>
            </div>

            <div className="right-content">
              <div className="room-waiting">
                <div className="room-detail inter-font">
                  <PersonPinIcon /> THÔNG TIN ĐỐI THỦ
                </div>
              </div>

              <RivalProfile rivalProfile={rivalProfile} />
              <LobbyChat />
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={openSnackbar}
        onClose={closeSnackbar}
        autoHideDuration={5000}
        message={matchMessage.text}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Backdrop
        sx={{
          backgroundColor: "black",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Lobby;
