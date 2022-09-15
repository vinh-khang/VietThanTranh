import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel({ maxHealth, currentHealth }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress color="inherit" variant="determinate" value={20} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography color="text.inherit">{20}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  // value: PropTypes.number.isRequired,
};

export default function LinearWithValueLabel({ maxHealth, currentHealth }) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel
        currentHealth={currentHealth}
        maxHealth={maxHealth}
      />
    </Box>
  );
}
