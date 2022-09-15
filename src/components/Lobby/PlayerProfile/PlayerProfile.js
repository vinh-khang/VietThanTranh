import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/userSlice";
import { Link } from "react-router-dom";
import { Crown, Flag } from "../../../assets";
// import flag from "../../../assets/elements/flag.png";
// import vuongmien from "../../../assets/elements/vuongmien.png";
// import bg1 from "../../../assets/elements/element-bg1.png";
import "./PlayerProfile.scss";

function PlayerProfile({ userInfo }) {
  const [isRival, setIsRival] = useState(false);
  useEffect(() => {
    // if (isOtherUser) {
    //   setUserInfo({
    //     displayName: isOtherUser.name,
    //     uid: isOtherUser.uid,
    //     photoURL: isOtherUser.photoURL,
    //   });
    //   setIsRival(true);
    // }
  }, []);

  return (
    <div className="profile-card" style={{ width: "18rem" }}>
      {!isRival && (
        <img
          src={Crown}
          alt="..."
          className="profile-crown"
          draggable={false}
        />
      )}

      <div className="profile-body text-center ">
        <img
          src={userInfo && userInfo.photoURL}
          className="img-fluid avatar-profile rounded-circle mt-2"
          alt="Player avatar"
          draggable={false}
        />
        <h5 className="card-title player-name">
          {userInfo && userInfo.displayName}
        </h5>
        <h6 className="level">Cấp {userInfo && userInfo.level}</h6>
        <i className="fas fa-fire text-center"></i>
      </div>
    </div>
  );
}

export default PlayerProfile;
