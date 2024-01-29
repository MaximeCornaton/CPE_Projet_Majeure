import { useState, useEffect } from "react";

const useFightData = () => {
  const [isFighting, setIsFightReady] = useState(false);

  useEffect(() => {
    const simulateFightPreparation = async () => {
      // Simulate backend delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Set fight ready status
      setIsFightReady(true);
    };

    simulateFightPreparation();
  }, []);

  return isFighting;
};

export default useFightData;
