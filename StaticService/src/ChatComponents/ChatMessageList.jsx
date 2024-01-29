import React from "react";
import { Comment } from "semantic-ui-react";
import ChatMessageItem from "./ChatMessageItem";

const ChatMessageList = ({ messages }) => {
  return (
    <Comment.Group>
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </Comment.Group>
  );
};

export default ChatMessageList;
