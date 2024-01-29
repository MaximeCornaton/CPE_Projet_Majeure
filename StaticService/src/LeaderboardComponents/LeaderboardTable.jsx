import React from "react";
import { Table } from "semantic-ui-react";

import LeaderboardItem from "./LeaderboardItem";

const LeaderboardTable = ({ leaderboardData }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Rank</Table.HeaderCell>
          <Table.HeaderCell>Username</Table.HeaderCell>
          <Table.HeaderCell>Level</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {leaderboardData.map((user, index) => (
          <LeaderboardItem key={index} user={user} rank={index + 1} />
        ))}
      </Table.Body>
    </Table>
  );
};

export default LeaderboardTable;
