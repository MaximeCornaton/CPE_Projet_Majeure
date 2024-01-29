import React from "react";
import { Segment, Dimmer, Loader } from "semantic-ui-react";

const FightWaiting = () => {
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
            <h3>Come back later to see if you have a match!</h3>
            <p>
              For now, you can swipe on other users to increase your chances of
              finding a match.
            </p>
          </Loader>
        </Dimmer>
      </div>
    </Segment>
  );
};

export default FightWaiting;
