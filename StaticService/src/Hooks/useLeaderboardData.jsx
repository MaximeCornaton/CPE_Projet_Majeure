import { useState, useEffect } from "react";

const useLeaderboardData = () => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost/userservice/leaderboard");
        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération des données du classement"
          );
        }
        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  return { leaderboardData, loading };
};

export default useLeaderboardData;
