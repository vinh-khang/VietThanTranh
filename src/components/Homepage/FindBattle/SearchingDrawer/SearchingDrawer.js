import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import MatchTimer from "../MatchTimer/MatchTimer";
import {
  foundMatch,
  addLobby,
} from "../../../../firebase/matches/matchServices";
import { Timdoithu, CancelBtn } from "../../../../assets";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../../store/userSlice";
import { db, collection, query, onSnapshot } from "../../../../firebase";
import { socket } from "../../../../utils/serverConfig";
import { useNavigate } from "react-router-dom";
import "./SearchingDrawer.scss";

export default function SearchingDrawer({ isFindingGame, cancelMatch }) {
  const [open, setOpen] = useState(false);
  const [matchPlayers, setMatchPlayers] = useState([]);
  let userInfo = useSelector(selectUserInfo);
  const navigate = useNavigate();

  const handleFoundMatch = async () => {
    isFindingGame &&
      (await foundMatch(userInfo.uid).then((res) => {
        if (res) {
          setMatchPlayers([{ uid: userInfo.uid, socketId: socket.id }, res[0]]);
        } else {
          setMatchPlayers([]);
        }
      }));
  };

  useEffect(() => {
    handleFoundMatch();

    if (matchPlayers.length < 2) {
      const q = query(collection(db, "SearchingPlayer"));
      let unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (
            change.type === "added" &&
            change.doc.data().uid !== userInfo.uid
          ) {
            setMatchPlayers([
              { uid: userInfo.uid, socketId: socket.id },
              change.doc.data(),
            ]);
          } else {
            setMatchPlayers([]);
          }
        });
      });
      return unsubscribe;
    }
    if (matchPlayers.length === 2) {
      addLobby(matchPlayers[0], matchPlayers[1]);
    }
  }, [isFindingGame]);

  return (
    <React.Fragment>
      <Drawer anchor="right" hideBackdrop={false} open={isFindingGame}>
        <Box className="searching-drawer" sx={{ width: "300px" }}>
          <Stack
            direction="column"
            justifyContent="space-around"
            alignItems="center"
            spacing={12}
            sx={{ heigth: 800 }}
          >
            <img src={Timdoithu} alt="..." className="search-drawer-img my-3" />

            <div className="match-timer-drawer">
              <MatchTimer isFindingGame={isFindingGame} />
            </div>
            <Divider />
            <Divider />
            <Chip
              label="THI ĐẤU CƠ BẢN 1V1"
              variant="outlined"
              sx={{ margin: "15px", color: "white", padding: "10px" }}
              onDelete={cancelMatch}
              className="sans-font bold"
            />

            {/* <div>
              <img
                src={CancelBtn}
                alt="..."
                className="cancel-btn my-3"
                style={{ width: "200px" }}
                onClick={() => cancelMatch()}
              />
            </div> */}
            {/* <Button
              variant="outlined"
              startIcon={<MilitaryTechIcon />}
              onClick={() => cancelMatch()}
              color="inherit"
              className="bold"
            >
              HỦY TÌM TRẬN
            </Button> */}
          </Stack>
        </Box>
      </Drawer>
      {/* <FoundedMatch isOpen={open} handleClose={handleClose} /> */}
    </React.Fragment>
  );
}
