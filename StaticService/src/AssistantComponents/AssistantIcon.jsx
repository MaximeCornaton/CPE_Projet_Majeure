import React from "react";
import { Button } from "semantic-ui-react";

const AssistantIcon = ({ onClick }) => {
  return <Button circular icon="question circle" onClick={onClick} />;
};

export default AssistantIcon;
