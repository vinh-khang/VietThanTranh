import React, { useRef, useState } from "react";
import { Divider, InputBase, ListSubheader, Stack, Box } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import "./LobbyChat.scss";

export default function LobbyChat({}) {
  const [name, setName] = React.useState("");

  const handleChange = (event) => {
    setName(event.target.value);
  };
  return (
    <>
      <Stack className="lobby-chat">
        <h4 className="inter-font text-center">CHAT</h4>
        <Box className="lobby-box-chat"></Box>
        <FormControl variant="standard" sx={{ marginTop: 1 }}>
          <InputLabel htmlFor="component-simple" className="lobby-chat">
            Nhập nội dung
          </InputLabel>
          <Input
            id="component-simple"
            value={name}
            onChange={handleChange}
            className="chat-input"
          />
        </FormControl>
      </Stack>
    </>
  );
}
