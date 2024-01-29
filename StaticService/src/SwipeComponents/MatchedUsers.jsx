import React from "react";
import { List, Button } from "semantic-ui-react";

import { useFight } from "../Hooks";

import { useNavigate } from "react-router-dom";

const MatchedUsers = ({ matchedUsers }) => {
  const navigate = useNavigate();
  const { initiateFight, error } = useFight();

  const handleFightRequest = (matchedUser) => {
    //console.log(matchedUser);
    initiateFight(matchedUser.userId);
  };

  const handleViewProfile = (matchedUser) => {
    navigate(`/profile/${matchedUser.userId}`);
  };

  return (
    <div>
      <h3>Utilisateurs Matchés</h3>
      <List divided relaxed>
        {matchedUsers.map((matchedUser) => (
          <List.Item key={matchedUser.userId}>
            <List.Content floated="left">
              <List.Header>{matchedUser.userLogin}</List.Header>
              <List.Description>{matchedUser.userId}</List.Description>
            </List.Content>
            <List.Content floated="right">
              <Button
                icon="bomb"
                color="red"
                onClick={() => handleFightRequest(matchedUser)}
              />
              <Button
                icon="eye"
                color="blue"
                onClick={() => handleViewProfile(matchedUser)}
              />
            </List.Content>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default MatchedUsers;
