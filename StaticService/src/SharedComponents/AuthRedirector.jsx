import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthentication } from "../Hooks";

const AuthRedirector = ({ children }) => {
  const { user } = useAuthentication();

  // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Sinon, affiche le contenu de l'enfant
  return <>{children}</>;
};

export default AuthRedirector;
