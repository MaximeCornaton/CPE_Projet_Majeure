import React from "react";
import { Button } from "semantic-ui-react";
import { useFight } from "../Hooks";

const NotificationIcon = ({ onClick }) => {
  const { fightRequests } = useFight();
  const numberOfRequests = fightRequests.length;

  return numberOfRequests > 0 ? (
    <Button
      color="red"
      icon="bell"
      onClick={onClick}
      content={numberOfRequests}
    />
  ) : (
    <Button icon="bell" onClick={onClick} />
  );
};

export default NotificationIcon;
