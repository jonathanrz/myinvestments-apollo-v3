import React, { useState, useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import createApolloClient from "./utils/createApolloClient";
import localStorage from "./utils/localStorage";
import MainPage from "./pages/Main";
import LoginPage from "./pages/Login";

function App() {
  const [token, setToken] = useState(() => localStorage.get("token"));

  const apolloClient = useMemo(
    () =>
      createApolloClient({
        getToken: () => token,
        onUnauthorized: () => setToken(null),
      }),
    [token]
  );

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage token={token} />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
