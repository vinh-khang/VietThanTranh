import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FindMatchBtn, CancelBtn } from "../../../assets";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/userSlice";
import buttonSoundEffect from "../../../assets/sound/button_effect/find_game_sound_effect.mp3";
import "./FindBattle.scss";
import SearchingDrawer from "./SearchingDrawer/SearchingDrawer";
import { IconButton } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Stack from "@mui/material/Stack";
import {
  searchingGame,
  deleteSearchingPlayer,
} from "../../../firebase/matches/matchServices";
import { socket } from "../../../utils/serverConfig";
const FindBattle = () => {
  const [isFindingGame, setIsFindingGame] = useState(false);
  const user = useSelector(selectUserInfo);

  const FindMatch = async () => {
    new Audio(buttonSoundEffect).play();
    setIsFindingGame(!isFindingGame);
    await searchingGame(user.uid, socket.id);
  };

  let cancelMatch = async () => {
    setIsFindingGame(false);
    await deleteSearchingPlayer();
  };

  return (
    <>
      <nav className="find-battle-container">
        <div className="find-battle-content">
          <Stack direction="row" spacing={1}>
            <img
              src={FindMatchBtn}
              className="img-fluid find-battle-btn "
              alt="..."
              onClick={() => FindMatch()}
            />
            <Link to="/lobby">
              <IconButton aria-label="delete" className="create-room">
                <GroupAddIcon className="icon" />
              </IconButton>
            </Link>
          </Stack>
        </div>
      </nav>
      <SearchingDrawer
        isFindingGame={isFindingGame}
        cancelMatch={cancelMatch}
      />
    </>
  );
};

export default FindBattle;
