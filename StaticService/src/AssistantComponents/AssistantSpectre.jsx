import React from "react";
import { Segment, Icon } from "semantic-ui-react";

const AssistantSpectre = ({ message }) => {
  return (
    <>
      <Icon name="assistive listening systems" size="big" />
      <p>{message}</p>
    </>
  );
};

export default AssistantSpectre;
