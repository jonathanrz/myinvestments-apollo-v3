import React, { useState, useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import createApolloClient from "./utils/createApolloClient";
import localStorage from "./utils/localStorage";
import MainPage from "./pages/Main";
import StocksPage from "./pages/Stocks";
import LoginPage from "./pages/Login";

function App() {
  const [token, setStateToken] = useState(() => localStorage.get("token"));

  const apolloClient = useMemo(
    () =>
      createApolloClient({
        getToken: () => token,
        onUnauthorized: () => setToken(undefined),
      }),
    [token]
  );

  function setToken(token?: string) {
    localStorage.set("token", token);
    setStateToken(token);
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Routes>
          <Route path="login" element={<LoginPage setToken={setToken} />} />
          <Route path="stocks" element={<StocksPage token={token} />} />
          <Route path="/" element={<MainPage token={token} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
