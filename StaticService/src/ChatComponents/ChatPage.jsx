import React from "react";
import ChatContainer from "./ChatContainer";
import { PageLayout, DataNotAvailable } from "../SharedComponents";

const ChatPage = () => {
  return (
    <PageLayout title="Chat">
      <ChatContainer />
    </PageLayout>
  );
};

export default ChatPage;
