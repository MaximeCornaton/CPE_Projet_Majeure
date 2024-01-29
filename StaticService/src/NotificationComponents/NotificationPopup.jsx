import React, { useState } from "react";
import { Popup } from "semantic-ui-react";
import NotificationIcon from "./NotificationIcon";

import NotificationList from "./NotificationList";
import { useFight } from "../Hooks";

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    
    setIsOpen(!isOpen);
  };

  return (
    <Popup
      trigger={<NotificationIcon onClick={handleToggle} />}
      content={isOpen && <NotificationList />}
      on="click"
      position="bottom right"
      open={isOpen}
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
    />
  );
};

export default NotificationPopup;
