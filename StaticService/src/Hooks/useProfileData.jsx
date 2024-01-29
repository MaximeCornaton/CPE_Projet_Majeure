import { useState, useEffect } from "react";

const useProfileData = (id) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost/userservice/user/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        const data = await response.json();
        //console.log("Received user :", data);
        setProfileData(data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur :", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { profileData, loading };
};

export default useProfileData;
