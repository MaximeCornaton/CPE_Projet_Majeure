import React from "react";
import { Message } from "semantic-ui-react";

const DataNotAvailable = ({ message }) => {
  return (
    <Message negative>
      <Message.Header>
        Oops! Data not available. Please try again later.
      </Message.Header>
      <p>{message}</p>
    </Message>
  );
};

export default DataNotAvailable;
