import React from "react";
import { Table, Image } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const LeaderboardItem = ({ user, rank }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate(`/profile/${user.userId}`);
  };

  return (
    <Table.Row onClick={handleProfileClick} style={{ cursor: "pointer" }}>
      <Table.Cell>
        <span style={{ fontWeight: "bold" }}>{rank}</span>
      </Table.Cell>
      <Table.Cell style={{ display: "flex", alignItems: "center" }}>
        <Image src={user.userImg} avatar style={{ marginRight: "10px" }} />
        <span style={{ fontWeight: "bold" }}>{user.userLogin}</span>
      </Table.Cell>
      <Table.Cell style={{ fontWeight: "bold" }}>{user.userLevel}</Table.Cell>
    </Table.Row>
  );
};

export default LeaderboardItem;
