import React from "react";
import { Segment } from "semantic-ui-react";
import ChatMessageList from "./ChatMessageList";

const ChatMessage = ({ messages, title }) => {
  return (
    <Segment>
      <h2>{title}</h2>
      <ChatMessageList messages={messages} />
    </Segment>
  );
};

export default ChatMessage;
