import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { PrivateRoute } from "./utils/common";
import Homepage from "./components/Homepage/Homepage";
import Login from "./components/Login/Login";
import Lobby from "./components/Lobby/Lobby";
import BattleStart from "./components/Homepage/Battle/BattleStart/BattleStart";
import Battle from "./components/Battle/Battle";
import BattlePlaying from "./components/BattlePlaying/BattlePlaying";
import "swiper/css/bundle";
import "./App.scss";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/battle-start"
          element={
            <PrivateRoute>
              <BattleStart />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby"
          element={
            <PrivateRoute>
              <Lobby />
            </PrivateRoute>
          }
        />
        <Route
          path="/battle"
          element={
            <PrivateRoute>
              <Battle />
            </PrivateRoute>
          }
        />
        <Route
          path="/battle-playing"
          element={
            <PrivateRoute>
              <BattlePlaying />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </DndProvider>
  );
}

export default App;
