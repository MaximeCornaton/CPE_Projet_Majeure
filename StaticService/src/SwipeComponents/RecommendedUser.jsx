import React from "react";
import { Button, Card, Image } from "semantic-ui-react";

const RecommendedUser = ({ userToRecommend, handleSwipe }) => (
  <Card centered style={{ maxWidth: "300px" }}>
    {
      //console.log("USER TO RECOMMEND", userToRecommend)
    }
    <Image src={userToRecommend.userImg} alt="Profile" wrapped ui={false} />
    <Card.Content>
      <Card.Header>{userToRecommend.userLogin}</Card.Header>
      <Card.Meta>Level: {userToRecommend.userLevel}</Card.Meta>
      <Card.Description>Attack: {userToRecommend.userAttack}</Card.Description>
      <Card.Description>
        Endurance: {userToRecommend.userEndurance}
      </Card.Description>
      <Card.Description>Life: {userToRecommend.userHp}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button.Group widths="2">
        <Button color="red" onClick={() => handleSwipe(false)}>
          Dislike
        </Button>
        <Button color="green" onClick={() => handleSwipe(true)}>
          Like
        </Button>
      </Button.Group>
    </Card.Content>
  </Card>
);

export default RecommendedUser;
