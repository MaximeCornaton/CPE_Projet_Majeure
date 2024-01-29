import React, { useEffect, useState } from "react";

const simulateFightLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return loading;
};

export default simulateFightLoading;
