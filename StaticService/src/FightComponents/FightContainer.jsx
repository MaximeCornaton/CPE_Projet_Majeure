import React, { useEffect } from "react";
import FightLoading from "./FightLoading";

import { DataNotAvailable } from "../SharedComponents";

import FightWebcam from "./FightWebcam";

import { useFight } from "../Hooks";

const FightContainer = () => {
  const { startFight, isWaiting, isFighting } = useFight();

  useEffect(() => {
    startFight();
  }, []);

  return (
    <>
      {isWaiting && <FightLoading />}
      {isFighting && <FightWebcam />}
      {!isWaiting && !isFighting && (
        <DataNotAvailable message="Error starting fight" />
      )}
    </>
  );
};

export default FightContainer;
