import React from "react";

const UserAvatar = ({ imageSrc, userName }) => {
  return (
    <div className="user-avatar">
      <img src={imageSrc} alt={`Avatar de ${userName}`} />
      <p>{userName}</p>
    </div>
  );
};

export default UserAvatar;
