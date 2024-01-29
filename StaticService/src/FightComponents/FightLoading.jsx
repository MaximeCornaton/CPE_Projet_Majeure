import React from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";

const FightLoading = () => (
  <Dimmer active inverted>
    <Loader inverted>Connecting with your opponent...</Loader>
  </Dimmer>
);

export default FightLoading;
