import { memo, useEffect, useState } from "react";
import { Stack } from "@mui/material";
import MiniArenaLand from "../MiniArenaLand/MiniArenaLand.js";
import "./MiniArena.scss";
const MiniArena = memo(function Container({
  allWarriorsLocations,
  attackedMyLands,
  isMyArena,
  isMyTurn,
}) {
  let initBattleLands = Array(169).fill({
    lastDroppedItem: null,
  });
  const [battleLands, setBattleLands] = useState(initBattleLands);

  return (
    <Stack direction="row" className="mini-arena-container">
      <div className="mini-arena-content">
        <h4 className="mini-arena-title">
          {isMyArena ? "SÀN ĐẤU CỦA BẠN" : "SÀN ĐẤU CỦA ĐỐI THỦ"}
        </h4>
        {battleLands.map((item, index) => (
          <MiniArenaLand
            value={index}
            key={index}
            active={allWarriorsLocations.includes(index)}
            attacked={attackedMyLands.includes(index)}
            isMyArena={isMyArena}
          />
        ))}
      </div>
    </Stack>
  );
});

export default MiniArena;
