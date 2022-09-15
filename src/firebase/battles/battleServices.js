import {
  doc,
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  setDoc,
  query,
  where,
  onSnapshot,
  documentId,
} from "firebase/firestore";
import { db, auth, firebase } from "../config";

const addBattle = async (data) => {
  try {
    let isFound = [];
    const q = query(
      collection(db, "Battles"),
      where("player1.uid", "==", data.player1.uid)
    );
    const q2 = query(
      collection(db, "Battles"),
      where("player2.uid", "==", data.player1.uid)
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
      await addDoc(collection(db, "Battles"), {
        player1: {
          ...data.player1,
          readyStatus: false,
          characterID: data.player1.characterID,
          attackedEnemyLands: [],
        },
        player2: {
          ...data.player2,
          readyStatus: false,
          characterID: data.player2.characterID,
          attackedEnemyLands: [],
        },
        lastTurn: null,
        currentTurn: null,
      });
    }
  } catch (e) {
    return e;
  }
};

const getNewBattle = async (uid) => {
  try {
    let battle = [];
    const q = query(collection(db, "Battles"), where("player1.uid", "==", uid));
    const q2 = query(
      collection(db, "Battles"),
      where("player2.uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      battle.push({ id: doc.id, ...doc.data() });
    });
    querySnapshot2.forEach((doc) => {
      battle.push({ id: doc.id, ...doc.data() });
    });

    return battle;
  } catch (e) {
    console.log(e);
  }
};

const getRivalProfileByMyID = async (uid) => {
  try {
    let battle = [];
    const q = query(collection(db, "Battles"), where("player1.uid", "==", uid));
    const q2 = query(
      collection(db, "Battles"),
      where("player2.uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    const querySnapshot2 = await getDocs(q2);
    querySnapshot.forEach((doc) => {
      battle.push({ ...doc.data(), player: 1 });
    });
    querySnapshot2.forEach((doc) => {
      battle.push({ ...doc.data(), player: 2 });
    });
    let rivalProfile = [];
    if (battle.length > 0) {
      let rivalID = [];
      if (battle[0].player === 1) {
        rivalID.push({ uid: battle[0].player2.uid, rivalNumber: 2 });
      } else {
        rivalID.push({ uid: battle[0].player1.uid, rivalNumber: 1 });
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

const getBattleCharacter = async (battle, number) => {
  try {
    if (number === 1) {
      let character = [];
      const q = query(collection(db, "Characters"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.id === battle.player1.characterID) {
          character.push(doc.data());
        }
      });

      return character;
    }

    if (number === 2) {
      let character = [];
      const q = query(collection(db, "Characters"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.id === battle.player2.characterID) {
          character.push(doc.data());
        }
      });

      return character;
    }
  } catch (e) {
    console.log(e);
  }
};

const readyForBattle = async (uid, warriorsInfo, number) => {
  try {
    if (number === 1) {
      const q = query(
        collection(db, "Battles"),
        where("player1.uid", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDoc(
          doc.ref,
          {
            player1: {
              uid: uid,
              readyStatus: true,
              warriorsInfo: warriorsInfo,
            },
          },
          { merge: true }
        );
      });
    }

    if (number === 2) {
      const q = query(
        collection(db, "Battles"),
        where("player2.uid", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setDoc(
          doc.ref,
          {
            player2: {
              uid: uid,
              readyStatus: true,
              warriorsInfo: warriorsInfo,
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

const deleteBattle = async (uid) => {
  try {
    const q = query(collection(db, "Battles"), where("player1.uid", "==", uid));
    const q2 = query(
      collection(db, "Battles"),
      where("player2.uid", "==", uid)
    );
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

const getBattleWarriors = async (player, number) => {
  try {
    if (number === 1) {
      let warriors = [];
      const q = query(
        collection(db, "Battles"),
        where("player1.uid", "==", player.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        warriors.push(...doc.data().player1.warriorsInfo);
      });

      return warriors;
    }

    if (number === 2) {
      let warriors = [];
      const q = query(
        collection(db, "Battles"),
        where("player2.uid", "==", player.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        warriors.push(...doc.data().player2.warriorsInfo);
      });

      return warriors;
    }
  } catch (e) {
    console.log(e);
  }
};

const updateAttackedEnemyLands = async (
  battleID,
  playerNumber,
  attackedEnemyLands
) => {
  try {
    const q = query(
      collection(db, "Battles"),
      where(documentId(), "==", battleID)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (playerNumber === 1) {
        setDoc(
          doc.ref,
          {
            player1: {
              attackedEnemyLands: attackedEnemyLands,
            },
          },
          { merge: true }
        );
      }

      if (playerNumber === 2) {
        setDoc(
          doc.ref,
          {
            player2: {
              attackedEnemyLands: attackedEnemyLands,
            },
          },
          { merge: true }
        );
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const updateLastTurn = async (battleID, lastTurn) => {
  try {
    const q = query(
      collection(db, "Battles"),
      where(documentId(), "==", battleID)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setDoc(
        doc.ref,
        {
          lastTurn: lastTurn,
        },
        { merge: true }
      );
    });
  } catch (e) {
    console.log(e);
  }
};

const updateCurrentTurn = async (battleID, currentTurn) => {
  try {
    const q = query(
      collection(db, "Battles"),
      where(documentId(), "==", battleID)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setDoc(
        doc.ref,
        {
          currentTurn: currentTurn,
        },
        { merge: true }
      );
    });
  } catch (e) {
    console.log(e);
  }
};

export {
  addBattle,
  getNewBattle,
  getRivalProfileByMyID,
  getBattleCharacter,
  readyForBattle,
  deleteBattle,
  getBattleWarriors,
  updateAttackedEnemyLands,
  updateLastTurn,
  updateCurrentTurn,
};
