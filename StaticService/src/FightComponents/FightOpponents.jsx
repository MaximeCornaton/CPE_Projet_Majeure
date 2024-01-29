import React from "react";
import { Segment, Dimmer, Loader } from "semantic-ui-react";
import { DataNotAvailable } from "../SharedComponents";

import { LeaderboardTable } from "../LeaderboardComponents";

const FightOpponents = ({ matchedUsers }) => {
  //if (!matchedUsers || matchedUsers.length === 0) {
  //return <DataNotAvailable message="No users found." />;
  //}

  return (
    <Segment>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <Dimmer active inverted>
          <Loader inverted>
            <h3>Here are your opponents!</h3>
            <p>
              You can ask one to fight by clicking on the "Fight" button or you
              can continue swiping to find a better match.
            </p>
            <LeaderboardTable leaderboardData={matchedUsers} />
          </Loader>
        </Dimmer>
      </div>
    </Segment>
  );
};

export default FightOpponents;
