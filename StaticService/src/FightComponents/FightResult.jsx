import React from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

import { Button } from "semantic-ui-react";

const FightResult = ({ fightResult }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user).user;

  const roundedHp = Math.round(fightResult.winner.userHp);

  if (fightResult.winner.userId === user.userId) {
    return (
      <div>
        <h1> You won! </h1>
        <p> Hp left: {roundedHp} </p>
        <Button onClick={() => navigate("/home")}>Back to home</Button>
      </div>
    );
  } else {
    return (
      <div>
        <h1> You lost! </h1>
        <p> Hp left: {roundedHp} </p>
        <Button onClick={() => navigate("/home")}>Back to home</Button>
      </div>
    );
  }
};

export default FightResult;
