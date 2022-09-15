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
} from "firebase/firestore";
import { db, auth, firebase } from "../config";

const getCharactersByUID = async (uid) => {
  try {
    let characterIDs = [];
    const q = query(
      collection(db, "Characters-Users"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      characterIDs.push(doc.data().characterID);
    });
    let characters = [];
    const q2 = query(collection(db, "Characters"));
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      if (characterIDs.includes(doc.id)) {
        characters.push({ ...doc.data(), id: doc.id });
      }
    });

    return characters;
  } catch (e) {
    console.log(e);
  }
};

const getAllCharacters = async (uid) => {
  try {
    let characters = [];
    const q = query(collection(db, "Characters"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      characters.push({ id: doc.id, ...doc.data() });
    });

    let charactersOfUser = [];
    const q2 = query(
      collection(db, "Characters-Users"),
      where("uid", "==", uid)
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach(async (doc) => {
      charactersOfUser.push(doc.data().characterID);
    });

    let finalCharacters = characters.map((item) => {
      if (charactersOfUser.includes(item.id)) {
        return { ...item, sold: true };
      } else {
        return { ...item, sold: false };
      }
    });

    return finalCharacters;
  } catch (e) {
    console.log(e);
  }
};

const buyNewCharacter = async (uid, characterCode) => {
  try {
    const userquery = query(
      collection(db, "UserProfile"),
      where("uid", "==", uid)
    );
    const querySnapshot = await getDocs(userquery);
    let gold = [];
    querySnapshot.forEach((doc) => {
      gold.push(doc.data().gold);
    });

    const characterquery = query(
      collection(db, "Characters"),
      where("code", "==", characterCode)
    );

    const querySnapshot2 = await getDocs(characterquery);
    let price = [];
    let characterID = [];
    querySnapshot2.forEach((doc) => {
      price.push(doc.data().price);
      characterID.push(doc.id);
    });
    if (price[0] <= gold[0]) {
      addDoc(collection(db, "Characters-Users"), {
        uid: uid,
        characterID: characterID[0],
      });
      querySnapshot.forEach((doc) => {
        setDoc(
          doc.ref,
          {
            gold: gold[0] - price[0],
          },
          { merge: true }
        );
      });
      return {
        code: 1,
        message: "Chúc mừng bạn đã chiêu mộ Thần Tướng thành công!",
        updatedGold: gold[0] - price[0],
      };
    } else {
      return {
        code: 0,
        message: "Rất tiếc, bạn không đủ Linh Châu",
      };
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteFriendInvitation = async (uid1, uid2) => {
  try {
    const q = query(
      collection(db, "Friends"),
      where("uid1", "==", uid1),
      where("uid2", "==", uid2)
    );
    const q2 = query(
      collection(db, "Friends"),
      where("uid1", "==", uid2),
      where("uid2", "==", uid1)
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

const updateFriendList = () => {
  const q = query(collection(db, "Friends"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.docChanges().length > 0) {
      return unsubscribe;
    }
  });
};

export {
  getCharactersByUID,
  getAllCharacters,
  buyNewCharacter,
  deleteFriendInvitation,
  updateFriendList,
};
