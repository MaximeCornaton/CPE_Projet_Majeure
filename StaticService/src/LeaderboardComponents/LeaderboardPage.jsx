import React from "react";

import { PageLayout, DataNotAvailable } from "../SharedComponents";
import { Loader } from "semantic-ui-react";
import LeaderboardTable from "./LeaderboardTable";

import { useLeaderboardData } from "../Hooks";

const LeaderboardPage = () => {
  const { leaderboardData, loading } = useLeaderboardData(); // Utilisez le hook pour récupérer les données du classement

  return (
    <PageLayout title="Leaderboard">
      {loading ? (
        <Loader active inline="centered" />
      ) : leaderboardData ? (
        <LeaderboardTable leaderboardData={leaderboardData} />
      ) : (
        <DataNotAvailable />
      )}
    </PageLayout>
  );
};

export default LeaderboardPage;
