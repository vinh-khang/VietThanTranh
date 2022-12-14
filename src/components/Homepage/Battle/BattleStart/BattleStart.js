import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import BattleBoard from "../BattleBoard/BattleBoard";
import { socket } from "../../../../utils/serverConfig";
import { selectUserInfo } from "../../../../store/userSlice";
import { selectMatchInfo } from "../../../../store/matchSlice";

import "./BattleStart.scss";

const BattleStart = () => {
  const [players, setPlayers] = useState([]);
  const [squarePlayer1, setSquarePlayer1] = useState([]);
  const [squarePlayer2, setSquarePlayer2] = useState([]);
  const [targetPlayer1, setTargetPlayer1] = useState([1, 2, 3]);
  const [targetPlayer2, setTargetPlayer2] = useState([1, 2, 3]);
  const [numberOfHit1, setNumberOfHit1] = useState(0);
  const [numberOfHit2, setNumberOfHit2] = useState(0);
  const [ready1, setReady1] = useState(false);
  const [ready2, setReady2] = useState(false);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    socket.on("squareattackPlayer1", (squareattackPlayer1) => {
      setSquarePlayer1((squarePlayer1) => [
        ...squarePlayer1,
        squareattackPlayer1,
      ]);
      setTurn(1);
    });

    socket.on("squareattackPlayer2", (squareattackPlayer2) => {
      setSquarePlayer2((squarePlayer2) => [
        ...squarePlayer2,
        squareattackPlayer2,
      ]);
      setTurn(0);
    });

    socket.on("readyForBattle1", (readyForBattle1) => {
      setTargetPlayer1([...readyForBattle1]);
      setReady1(!ready1);
    });

    socket.on("readyForBattle2", (readyForBattle2) => {
      setTargetPlayer2([...readyForBattle2]);
      setReady2(!ready2);
    });

    socket.on("roomData", (players) => {
      setPlayers(players.users);
    });
  }, []);

  const sendSquarePlayer = (value, id, userID) => {
    if (id === 0 && userID !== socket.id) {
      if (value && socket) {
        socket.emit("attackPlayer1", value, () =>
          setSquarePlayer1([...squarePlayer1, value])
        );
      }

      if (targetPlayer1.includes(value)) {
        setNumberOfHit1(numberOfHit1 + 1);
        if (targetPlayer1.length === numberOfHit1 + 1)
          alert(`Player with ID = ${id} lose!`);
      }

      setTurn(1);
    }

    if (id === 1 && userID !== socket.id) {
      if (value && socket) {
        socket.emit("attackPlayer2", value, () =>
          setSquarePlayer2([...squarePlayer2, value])
        );
      }

      if (targetPlayer2.includes(value)) {
        setNumberOfHit2(numberOfHit2 + 1);
        if (targetPlayer2.length === numberOfHit2 + 1)
          alert(`Player with ID = ${id} lose!`);
      }

      setTurn(0);
    }
  };

  const readyForBattle = (id) => {
    if (id === 0) {
      socket.emit("readyForBattle1", targetPlayer1);
      setReady1(!ready1);
    } else {
      socket.emit("readyForBattle2", targetPlayer2);
      setReady2(!ready2);
    }
  };

  return (
    <>
      <div className="homepage-container">
        <div className="start-battle-content">
          <div className="flex-battle-board">
            <div className="battle-board">
              <BattleBoard
                user={players ? players[0] : {}}
                id={0}
                socket={socket.id}
                square={squarePlayer1}
                sendSquare={sendSquarePlayer}
                targetPlayer={targetPlayer1}
                setTargetPlayer={setTargetPlayer1}
                readyForBattle={readyForBattle}
                ready={ready1}
                turn={turn}
              />
            </div>
            <div className="battle-board">
              <BattleBoard
                user={players ? players[1] : {}}
                id={1}
                socket={socket.id}
                square={squarePlayer2}
                sendSquare={sendSquarePlayer}
                targetPlayer={targetPlayer2}
                setTargetPlayer={setTargetPlayer2}
                readyForBattle={readyForBattle}
                ready={ready2}
                turn={turn}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BattleStart;
