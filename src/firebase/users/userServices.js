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
import { socket } from "../../utils/serverConfig";

const addOnlineUser = async (uid) => {
  try {
    const q = query(collection(db, "OnlineUsers"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let onlineUsers = [];
    querySnapshot.forEach((doc) => {
      onlineUsers.push(doc.data());
    });

    if (onlineUsers.length === 0) {
      addDoc(collection(db, "OnlineUsers"), {
        uid: uid,
        socketId: socket.id,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const removeOnlineUser = async (uid) => {
  try {
    const q = query(collection(db, "OnlineUsers"), where("uid", "==", uid));
    console.log(uid);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log(e);
  }
};

const getOnlineUserByID = async (uid) => {
  try {
    const q = query(collection(db, "OnlineUsers"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let onlineUsers = [];
    querySnapshot.forEach((doc) => {
      onlineUsers.push(doc.data());
    });
    return onlineUsers;
  } catch (e) {
    console.log(e);
  }
};

const getOnlineUserByName = async (name) => {
  try {
    const q = query(
      collection(db, "UserProfile"),
      where("displayName", "==", name)
    );
    const querySnapshot = await getDocs(q);
    let user = [];
    querySnapshot.forEach((doc) => {
      user.push(doc.data());
    });
    return user;
  } catch (e) {
    console.log(e);
  }
};

const getUserByID = async (uid) => {
  try {
    const q = query(collection(db, "UserProfile"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let user = [];
    querySnapshot.forEach((doc) => {
      user.push(doc.data());
    });
    return user;
  } catch (e) {
    console.log(e);
  }
};

const getOnlineUserBySocket = async (socketId) => {
  try {
    const q = query(
      collection(db, "OnlineUsers"),
      where("socketId", "==", socketId)
    );
    const querySnapshot = await getDocs(q);
    let onlineUsers = [];
    querySnapshot.forEach((doc) => {
      onlineUsers.push(doc.data());
    });
    return onlineUsers;
  } catch (e) {
    console.log(e);
  }
};

const deleteOnlineUserByID = async (uid) => {
  try {
    const q = query(collection(db, "OnlineUsers"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log(e);
  }
};

const deleteOnlineUserBySocket = async (socketId) => {
  try {
    const q = query(
      collection(db, "OnlineUsers"),
      where("socketId", "==", socketId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  } catch (e) {
    console.log(e);
  }
};

const getUserProfile = async (uid) => {
  try {
    const q = query(collection(db, "UserProfile"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    let userProfile = [];
    querySnapshot.forEach((doc) => {
      userProfile.push(doc.data());
    });
    return userProfile;
  } catch (e) {
    console.log(e);
  }
};

const createNewUserProfile = async (user) => {
  try {
    await addDoc(collection(db, "UserProfile"), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      exp: 0,
      gold: 0,
      level: 1,
    });
    return {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      exp: 0,
      gold: 0,
      level: 1,
    };
  } catch (e) {
    console.log(e);
  }
};

export {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUserByID,
  deleteOnlineUserByID,
  deleteOnlineUserBySocket,
  getOnlineUserBySocket,
  createNewUserProfile,
  getUserProfile,
  getOnlineUserByName,
  getUserByID,
};
