import React from "react";
import { useParams } from "react-router-dom";

import { PageLayout, DataNotAvailable } from "../SharedComponents";
import { Loader } from "semantic-ui-react";

import ProfileDetails from "./ProfileDetails";
import MatchResults from "./MatchResults";

import { useProfileData } from "../Hooks";

const ProfilePage = () => {
  const { id } = useParams();
  const { profileData, loading } = useProfileData(id);

  const results = [
    {
      date: "2020-01-01",
      opponentName: "John Doe",
      opponentImg: "https://react.semantic-ui.com/images/avatar/small/joe.jpg",
      outcome: "Win",
      score: 100,
    },
    {
      date: "2020-01-02",
      opponent: "Jane Doe",
      opponentImg: "https://react.semantic-ui.com/images/avatar/small/joe.jpg",
      outcome: "Loss",
      score: 50,
    },
  ];

  return (
    <PageLayout title="Profile">
      {loading ? (
        <Loader active inline="centered" />
      ) : profileData ? (
        <>
          <ProfileDetails profileData={profileData} />
          {
            //<MatchResults results={results} />
          }
        </>
      ) : (
        <DataNotAvailable />
      )}
    </PageLayout>
  );
};

export default ProfilePage;
