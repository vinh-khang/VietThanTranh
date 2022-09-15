import { useEffect } from "react";
import "./MiniArenaLand.scss";
const MiniArenaLand = ({ active, attacked, isMyArena }) => {
  let nameofClass;
  if (attacked && active) nameofClass = "battle-square-container hit";
  else if (attacked) nameofClass = "battle-square-container attacked";
  else if (active && isMyArena) nameofClass = "battle-square-container active";
  else nameofClass = "battle-square-container";

  return <div className={nameofClass}></div>;
};

export default MiniArenaLand;
