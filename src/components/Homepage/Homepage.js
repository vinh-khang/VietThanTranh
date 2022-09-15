import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import FindBattle from "./FindBattle/FindBattle";
import Listfriend from "./Listfriend/Listfriend";
import { useSelector, useDispatch } from "react-redux";
import { selectUserInfo, updateUserInfo } from "../../store/userSlice";
import { socket } from "../../utils/serverConfig";
import { db, collection, query, onSnapshot } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./Homepage.scss";
import {
  getUserProfile,
  createNewUserProfile,
  addOnlineUser,
} from "../../firebase/users/userServices";
import _ from "lodash";
const Homepage = () => {
  const navigate = useNavigate();
  let user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const createNewUser = async () => {
    await getUserProfile(user.uid).then(async (res) => {
      if (_.isEmpty(res)) {
        await createNewUserProfile(user);
      } else {
        dispatch(updateUserInfo({ ...res[0], isLoggin: true }));
      }
    });
    await addOnlineUser(user.uid);
  };
  useEffect(() => {
    if (user && user.uid) {
      createNewUser();
    }
  }, []);

  useEffect(() => {
    const q = query(collection(db, "Lobby"));
    let unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (
          change.type === "added" &&
          ((change.doc.data().player1.uid === user.uid &&
            change.doc.data().player1.socketId === socket.id) ||
            (change.doc.data().player2.uid === user.uid &&
              change.doc.data().player2.socketId === socket.id))
        ) {
          navigate("/lobby");
        } else {
          navigate("/");
        }
      });
    });
    return unsubscribe;
  }, []);

  return (
    <>
      <div className="homepage-container noselect">
        <div className="homepage-content">
          <Header />
          <div className="main-content">
            <div className="left-content">
              <Listfriend />
            </div>
            <div className="right-content"></div>
          </div>
          <Footer>
            <FindBattle />
          </Footer>
        </div>
      </div>
    </>
  );
};

export default Homepage;
