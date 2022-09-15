import { memo, useEffect } from "react";
import "./BattleSquare.scss";
const style = {
  height: "45px",
  width: "45px",
  color: "white",
  float: "left",
};
const BattleSquare = memo(function BattleSquare({
  active,
  value,
  attackArenaLand,
  attacked,
  isMyTurn,
}) {
  let nameofClass = "playing-battle-square-container no-pointer";
  if (isMyTurn) {
    if (attacked && active) nameofClass = "playing-battle-square-container hit";
    else if (attacked) nameofClass = "playing-battle-square-container attacked";
    else nameofClass = "playing-battle-square-container";
  } else {
    if (attacked && active)
      nameofClass = "playing-battle-square-no-pointer hit";
    else if (attacked)
      nameofClass = "playing-battle-square-no-pointer attacked";
    else nameofClass = "playing-battle-square-no-pointer";
  }

  return (
    <div
      style={{ ...style }}
      className={nameofClass}
      onClick={() => attackArenaLand(value)}
    ></div>
  );
});

export default BattleSquare;
