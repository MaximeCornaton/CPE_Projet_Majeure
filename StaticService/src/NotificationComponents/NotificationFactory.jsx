import React from "react";
import Notification from "./Notification";

const NotificationFactory = ({ type, ...props }) => {
  switch (type) {
    case "success":
      return <Notification type={type} icon={"checkmark"} {...props} />;
    case "error":
      return <Notification type={type} icon={"warning sign"} {...props.notifications} />;
    case "info":
      return <Notification type={type} icon={"info circle"} {...props.notifications} />;
    default:
      return null;
  }
};

export default NotificationFactory;
