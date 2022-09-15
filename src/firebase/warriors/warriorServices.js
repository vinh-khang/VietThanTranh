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
  orderBy,
} from "firebase/firestore";
import { db, auth, firebase } from "../config";

const getWarriorsByCharacterID = async (id) => {
  try {
    const q = query(
      collection(db, "Warriors"),
      orderBy("health", "desc"),
      orderBy("name", "asc"),
      where("characterID", "==", id)
    );
    const querySnapshot = await getDocs(q);
    let warriors = [];
    querySnapshot.forEach((doc) => {
      warriors.push(doc.data());
    });
    return warriors;
  } catch (e) {
    console.log(e);
  }
};

const addNewFriend = async (data) => {
  try {
    if (data.uid1 === data.uid2)
      return {
        err: 1,
        message: "Không thể tự gửi lời mời kết bạn cho bản thân!",
      };
    const q = query(
      collection(db, "Friends"),
      where("uid2", "==", data.uid2),
      where("uid1", "==", data.uid1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty)
      return {
        err: 2,
        message: "Bạn đã gửi lời mời kết bạn đến người chơi này!",
      };
    await addDoc(collection(db, "Friends"), {
      uid1: data.uid1,
      uid2: data.uid2,
      status: data.status,
    });
  } catch (e) {
    console.log(e);
  }
};

const acceptNewFriend = async (uid1, uid2) => {
  try {
    const q = query(
      collection(db, "Friends"),
      where("uid1", "==", uid1),
      where("uid2", "==", uid2)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setDoc(
        doc.ref,
        {
          status: "Accepted",
        },
        { merge: true }
      );
    });
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
  getWarriorsByCharacterID,
  addNewFriend,
  acceptNewFriend,
  deleteFriendInvitation,
  updateFriendList,
};
