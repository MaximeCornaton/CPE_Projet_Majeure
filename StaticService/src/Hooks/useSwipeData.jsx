import { useState, useEffect } from "react";

import { useSelector } from "react-redux";

const useSwipeData = () => {
  const [userToRecommend, setUserToRecommend] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [jarvisMessage, setJarvisMessage] = useState(null);
  const [isMatch, setIsMatch] = useState(false);

  const user = useSelector((state) => state.user).user;

  const fetchUserToRecommend = async () => {
    try {
      const response = await fetch(
        "http://localhost/matchservice/getRecommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: user.userId,
        }
      );

      if (response.ok) {
        const userData = await response.json();
        //console.log("Received user USESWIPE:", userData);
        setUserToRecommend(userData);
      } else {
        console.error(
          "Erreur lors de la récupération de l'utilisateur recommandé :",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'utilisateur recommandé :",
        error
      );
    }
  };

  const fetchMatchedUsers = async () => {
    try {
      const response = await fetch("http://localhost/matchservice/getMatches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: user.userId,
      });

      if (response.ok) {
        const matchedUsersData = await response.json();
        setMatchedUsers(matchedUsersData);
        //console.log("Matched users : ", matchedUsers);
      } else {
        console.error(
          "Erreur lors de la récupération des utilisateurs matchés :",
          response.statusText
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs matchés :",
        error
      );
    }
  };

  const handleSwipe = async (isLiked) => {
    try {
      // Logique de gestion du swipe
      if (isLiked) {
        const response = await fetch("http://localhost/matchservice/isMatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userLiking: user.userId,
            userLiked: userToRecommend.userId,
          }),
        });
        // Si response = true, alors il y a match
        if (response.ok) {
          const isMatch = await response.json();
          if (isMatch) {
            //console.log("MATCH !");
            setIsMatch(true);
          } else {
            setIsMatch(false);
          }
        } else {
          console.error(
            "Erreur lors de la récupération de l'utilisateur recommandé :",
            response.statusText
          );
        }
      }

      await Promise.all([fetchUserToRecommend(), fetchMatchedUsers()]);
    } catch (error) {
      console.error("Erreur lors du swipe :", error);
    }
  };

  const sendToJarvis = async (message) => {
    try {
      // Ajoutez la requête pour envoyer le userID à la fonction jarvis
      const response = await fetch("http://localhost/dataservice/jarvis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: user.userId,
          recommendUserID: userToRecommend.userId,
          message: message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setJarvisMessage(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête jarvis :", error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    await Promise.all([fetchUserToRecommend(), fetchMatchedUsers()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    //console.log("A RECOMMENDER", userToRecommend);
  }, [userToRecommend]); // Log lorsque userToRecommend change

  return {
    userToRecommend,
    matchedUsers,
    isLoading,
    handleSwipe,
    sendToJarvis,
    jarvisMessage,
    isMatch,
  };
};

export default useSwipeData;
