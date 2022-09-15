import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../store/userSlice";
import storage from "redux-persist/lib/storage";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const userInfo = useSelector(selectUserInfo);
  return userInfo.isLoggin ? children : <Navigate to="/login" />;
}
const logout = () => {};

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { PrivateRoute, logout, randomIntFromInterval };

// Hook
