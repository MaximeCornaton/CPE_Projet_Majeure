import React from "react";
import { Loader, Message } from "semantic-ui-react";
import {
  PageLayout,
  DataNotAvailable,
  InstructionsMessage,
} from "../SharedComponents";

import { useSwipeData } from "../Hooks";

import MatchedUsers from "./MatchedUsers";
import RecommendedUser from "./RecommendedUser";
import MatchPopup from "./MatchPopup";
import { useSocketContext } from "../Hooks/SocketProvider";


import { AssistantPopup } from "../AssistantComponents";

const SwipePage = () => {
  const {
    userToRecommend,
    matchedUsers,
    isLoading,
    handleSwipe,
    sendToJarvis,
    jarvisMessage,
    isMatch,
  } = useSwipeData();


  const { nodeSocket } = useSocketContext();

  // useEffect(() => {
  //   if (nodeSocket) {
  //     nodeSocket.on("fightRequest", data)
  //   }
  // }, [nodeSocket]);



  if (isLoading) {
    return (
      <PageLayout title="Select your opponents">
        <Loader active inline="centered" />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Select your opponents">
      <>
        <InstructionsMessage
          header="Instructions"
          content="View the user's profile, then swipe right if interested or left if not. Make your selection below."
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            position: "relative",
          }}
        >
          {isMatch && <MatchPopup name={userToRecommend.name} />}
          <MatchedUsers matchedUsers={matchedUsers} />
          {userToRecommend ? (
            <RecommendedUser
              userToRecommend={userToRecommend}
              handleSwipe={handleSwipe}
            />
          ) : (
            <DataNotAvailable message="No more users to swipe" />
          )}
        </div>
      </>
      <AssistantPopup
        sendToJarvis={sendToJarvis}
        jarvisMessage={jarvisMessage}
      />
    </PageLayout>
  );
};

export default SwipePage;
