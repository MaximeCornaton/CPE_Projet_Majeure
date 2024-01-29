import React from "react";
import { PageLayout, DataNotAvailable } from "../SharedComponents";

import { Loader } from "semantic-ui-react";

import FightContainer from "./FightContainer";
import FightWaiting from "./FightWaiting";
import FightOpponents from "./FightOpponents";

import FightResult from "./FightResult";

import { useSwipeData } from "../Hooks";
import { useFight } from "../Hooks";

//import { simulateFightData } from "../Hooks";

const FightPage = () => {
  //let isFighting = simulateFightData();
  const { matchedUsers } = useSwipeData();
  const { isWaiting, isFighting, error, noAction, fightResult } = useFight();

  //console.log(noAction, fightResult);
  //noAction = true;
  //fightResult = "win";

  //if (isLoading) return <Loader active inline="centered" />;

  if (error) {
    return <DataNotAvailable message={error} />;
  }
  //console.log(noAction, fightResult);
  if (noAction && fightResult) {
    return (
      <PageLayout title="Fight">
        <FightResult fightResult={fightResult} />
      </PageLayout>
    );
  } else {
    return (
      <>
        {isFighting || isWaiting ? (
          <PageLayout title="Fight">
            <FightContainer />
          </PageLayout>
        ) : (
          <>
            {matchedUsers && matchedUsers.length > 0 ? (
              <FightOpponents matchedUsers={matchedUsers} />
            ) : (
              <FightWaiting />
            )}
          </>
        )}
      </>
    );
  }
};

export default FightPage;
