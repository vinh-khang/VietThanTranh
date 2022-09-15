import { memo, useEffect } from "react";
import { useDrop } from "react-dnd";
import { Avatar } from "@mui/material";
import "./BattleSquare.scss";
const style = {
  height: "45px",
  width: "45px",
  color: "white",
  float: "left",
  borderRadius: "5px",
  paddingTop: "2px",
};
const BattleSquare = memo(function Dustbin({
  accept,
  lastDroppedItem,
  onDrop,
  handleDropHover,
  value,
  dropHover,
  dropHoverError,
  active,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = isOver && canDrop;

  useEffect(() => {
    isActive && handleDropHover(value);
    !canDrop && handleDropHover(-1);
  }, [isActive, canDrop]);

  return (
    <div
      ref={drop}
      style={{ ...style }}
      className={
        (dropHover && "battle-square-container drop-hover") ||
        (dropHoverError && "battle-square-container drop-hover-error") ||
        "battle-square-container"
      }
      data-testid="dustbin"
    >
      {lastDroppedItem && active && (
        <div className="battle-board">
          <Avatar
            src={lastDroppedItem.photoURL}
            sx={{ margin: "auto" }}
            className="warrior-board-square"
          />
        </div>
      )}
    </div>
  );
});

export default BattleSquare;
