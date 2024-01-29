import React, { useState, useEffect } from "react";
import { useAuthentication } from "../Hooks";
import { Container } from "semantic-ui-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { DataNotAvailable } from "../SharedComponents";
import { useSocketContext } from "../Hooks/SocketProvider";

const ChatContainer = () => {
  const { nodeSocket } = useSocketContext();
  const [chatMessages, setChatMessages] = useState([]);
  const { error, user } = useAuthentication();

  useEffect(() => {
    const handleBroadcastMessage = (data) => {
      const newMessage = {
        id: data.id,
        senderId: data.senderId,
        sender: data.sender,
        content: data.message,
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    nodeSocket.on("broadcastMessage", handleBroadcastMessage);

    return () => {
      nodeSocket.off("broadcastMessage", handleBroadcastMessage);
    };
  }, [nodeSocket]);

  const handleSendMessage = (message) => {
    nodeSocket.emit("chatMessage", {
      senderId: user.userId,
      sender: user.login,
      message: message,
    });
  };

  if (error) {
    return <DataNotAvailable message={error}></DataNotAvailable>;
  }

  return (
    <Container>
      <ChatMessage messages={chatMessages} title="Global chat" />
      <ChatInput onSendMessage={handleSendMessage} />
    </Container>
  );
};

export default ChatContainer;
