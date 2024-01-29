import React from "react";

import { SwipePage } from "../SwipeComponents";
import WelcomePage from "./WelcomePage";

import { useAuthentication } from "../Hooks";

const HomePage = () => {
  const { user } = useAuthentication();

  return <>{user ? <SwipePage /> : <WelcomePage />}</>;
};

export default HomePage;
