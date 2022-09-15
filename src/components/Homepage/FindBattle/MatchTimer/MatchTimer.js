import React from "react";
import { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import "./MatchTimer.scss";

function MatchTimer({ isFindingGame, setIsFindingGame }) {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (isFindingGame) {
      const timer = setInterval(() => {
        setSeconds(seconds + 1);
        if (seconds === 59) {
          setMinutes(minutes + 1);
          setSeconds(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setSeconds(0);
      setMinutes(0);
    }
  }, [isFindingGame, seconds, minutes]);

  return (
    <>
      {isFindingGame ? (
        <div className="match-timer-container">
          <div className="time-number sans-font bold">
            {minutes} : {seconds}
          </div>
          <div className="text-center blue sans-font">
            Thời gian ước tính: 1:00
          </div>
        </div>
      ) : (
        <div className="match-timer-container find_now"></div>
      )}
    </>
  );
}

export default MatchTimer;
