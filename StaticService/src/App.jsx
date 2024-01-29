import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { GlobalHeader, GlobalFooter, HomePage } from "./GlobalComponents";

import { PageLayout, AuthRedirector } from "./SharedComponents";
import { RegisterForm, LoginForm } from "./FormComponents";
import { LeaderboardPage } from "./LeaderboardComponents";
import { ProfilePage } from "./UserComponents";
import { ChatPage } from "./ChatComponents";
import { FightPage } from "./FightComponents";

function App() {
  return (
    <Router>
      <GlobalHeader />
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route
          path="/register"
          element={
            <PageLayout title="Register">
              <RegisterForm />
            </PageLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PageLayout title="Login">
              <LoginForm />
            </PageLayout>
          }
        />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route
          path="/chat"
          element={
            <AuthRedirector>
              <ChatPage />
            </AuthRedirector>
          }
        />
        <Route
          path="/fight"
          element={
            <AuthRedirector>
              <FightPage />
            </AuthRedirector>
          }
        />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>

      <GlobalFooter />
    </Router>
  );
}

export default App;
