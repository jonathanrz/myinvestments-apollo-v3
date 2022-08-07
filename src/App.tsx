import React, { useState, useMemo } from "react";
import { ApolloProvider } from "@apollo/client";
import createApolloClient from "./utils/createApolloClient";

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
      <div>App</div>
    </ApolloProvider>
  );
}

export default App;
