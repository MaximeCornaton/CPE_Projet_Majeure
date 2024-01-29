import React, { useState } from "react";
import { Segment, Input, Button } from "semantic-ui-react";

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    // Call the parent component's function to send the message
    onSendMessage(message);
    setMessage("");
  };

  return (
    <Segment>
      <Input
        fluid
        value={message}
        onChange={handleMessageChange}
        placeholder="Type a message..."
        action={<Button onClick={handleSendMessage}>Send</Button>}
      />
    </Segment>
  );
};

export default ChatInput;
