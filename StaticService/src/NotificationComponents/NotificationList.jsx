import React, { useEffect, useState } from "react";
//import NotificationFactory from "./NotificationFactory";
import { DataNotAvailable } from "../SharedComponents";
import { useFight } from "../Hooks";
import Notification from "./Notification";

const NotificationList = () => {
  const { error, acceptFight, fightRequests } = useFight();

  if (fightRequests.length < 1) {
    return <div> No notifications. </div>;
  }

  return (
    <div>
      {error && <DataNotAvailable message={error} />}
      {fightRequests.map((request) => (
        <Notification
          key={request.id}
          type="positive"
          header="Fight!"
          content={"You have a fight request from : " + request.senderID}
          icon="check"
          link="/fight"
          buttonTitle="Accept Fight"
          onClick={() => acceptFight(request.id)}
        />
      ))}
    </div>
  );
};

export default NotificationList;
