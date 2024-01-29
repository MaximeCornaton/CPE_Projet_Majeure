// MatchResults.js
import React from "react";
import { Header, Divider, Feed } from "semantic-ui-react";

const MatchResults = ({ results }) => {
  return (
    <>
      <Header as="h2" dividing style={{ color: "#333", marginBottom: "20px" }}>
        Derniers Résultats de Matchs
      </Header>
      <Feed>
        {results.map((result, index) => (
          <Feed.Event key={index}>
            <Feed.Label>
              <img src={result.opponentImg} alt="Result" />
            </Feed.Label>
            <Feed.Content>
              <Feed.Date content={result.date} />
              <Feed.Summary>
                Vous avez {result.outcome} le match contre{" "}
                <a href="/">{result.opponentName}</a>.
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        ))}
      </Feed>
    </>
  );
};

export default MatchResults;
