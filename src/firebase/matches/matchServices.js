import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db, auth, firebase } from "../config";
import { socket } from "../../utils/serverConfig";

const searchingGame = async (uid, socketId) => {
  try {
    let isFound = [];
    const q = query(collection(db, "SearchingPlayer"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      isFound.push(doc.data());
    });

    if (isFound.length === 0) {
      if (socket.id) {
        await addDoc(collection(db, "SearchingPlayer"), {
          uid: uid,
          socketId: socketId,
        });
      }
    }
  } catch (e) {
    return e;
  }
};

const deleteSearchingPlayer = async () => {
  try {
    const q = query(
      collection(db, "SearchingPlayer"),
      where("socketId", "==", socket.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    return e;
  }
};

const getSearchingPlayer = async () => {
  try {
    let searchingPlayers = [];
    const q = query(collection(db, "SearchingPlayer"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      searchingPlayers.push(doc.data());
    });
    return searchingPlayers;
  } catch (e) {
    console.log(e);
  }
};

const foundMatch = async (uid) => {
  try {
    let players = [];
    await getSearchingPlayer().then((res) => {
      if (res.length > 0) {
        res.forEach((item) => {
          if (item.uid !== uid && players.length === 0) {
            players.push(item);
          }
        });
      }
    });
    return players;
  } catch (e) {
    console.log(e);
  }
};

const addLobby = async (player1, player2) => {
  try {
    let isFound = [];
    const q = query(
      collection(db, "Lobby"),
      where("player1.uid", "==", player1.uid)
    );
    const q2 = query(
      collection(db, "Lobby"),
      where("player2.uid", "==", player1.uid)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      isFound.push(doc.data());
    });
    querySnapshot2.forEach((doc) => {
      isFound.push(doc.data());
    });

    if (isFound.length === 0) {
      await addDoc(collection(db, "Lobby"), {
        player1: { ...player1, characterID: "", readyStatus: false },
        player2: { ...player2, characterID: "", readyStatus: false },
        time: 30,
      });

      const deleteQ1 = query(
        collection(db, "SearchingPlayer"),
        where("uid", "==", player1.uid)
      );
      const deleteQ2 = query(
        collection(db, "SearchingPlayer"),
        where("uid", "==", player2.uid)
      );

      const deleteSnapshot = await getDocs(deleteQ1);
      const deleteSnapshot2 = await getDocs(deleteQ2);

      deleteSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      deleteSnapshot2.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    }
  } catch (e) {
    return e;
  }
};

const getNewLobby = async (uid) => {
  try {
    let lobby = [];
    const q = query(collection(db, "Lobby"), where("player1.uid", "==", uid));
    const q2 = query(collection(db, "Lobby"), where("player2.uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      lobby.push(doc.data());
    });
    querySnapshot2.forEach((doc) => {
      lobby.push(doc.data());
    });
    return lobby;
  } catch (e) {
    console.log(e);
  }
};

const deleteLobby = async (uid) => {
  try {
    const q = query(collection(db, "Lobby"), where("player1.uid", "==", uid));
    const q2 = query(collection(db, "Lobby"), where("player2.uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    querySnapshot2.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log(e);
  }
};

const getRivalProfileByMyID = async (uid) => {
  try {
    let lobby = [];
    const q = query(collection(db, "Lobby"), where("player1.uid", "==", uid));
    const q2 = query(collection(db, "Lobby"), where("player2.uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      lobby.push({ ...doc.data(), player: 1 });
    });
    querySnapshot2.forEach((doc) => {
      lobby.push({ ...doc.data(), player: 2 });
    });
    let rivalProfile = [];
    if (lobby.length > 0) {
      let rivalID = [];
      if (lobby[0].player === 1) {
        rivalID.push({ uid: lobby[0].player2.uid, rivalNumber: 2 });
      } else {
        rivalID.push({ uid: lobby[0].player1.uid, rivalNumber: 1 });
      }
      const q = query(
        collection(db, "UserProfile"),
        where("uid", "==", rivalID[0].uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        rivalProfile.push({
          ...doc.data(),
          rivalNumber: rivalID[0].rivalNumber,
        });
      });
    }
    return rivalProfile;
  } catch (e) {
    console.log(e);
  }
};

const readyForMatch = async (uid, characterID, number) => {
  try {
    if (number === 1) {
      const q = query(collection(db, "Lobby"), where("player1.uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDoc(
          doc.ref,
          {
            player1: {
              characterID: characterID,
              readyStatus: true,
            },
          },
          { merge: true }
        );
      });
    }

    if (number === 2) {
      const q = query(collection(db, "Lobby"), where("player2.uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDoc(
          doc.ref,
          {
            player2: {
              characterID: characterID,
              readyStatus: true,
            },
          },
          { merge: true }
        );
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export {
  searchingGame,
  deleteSearchingPlayer,
  getSearchingPlayer,
  foundMatch,
  addLobby,
  deleteLobby,
  getNewLobby,
  getRivalProfileByMyID,
  readyForMatch,
};
