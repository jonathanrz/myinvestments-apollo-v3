import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { GraphQLErrors } from "@apollo/client/errors";
import { setContext } from "@apollo/client/link/context";
import { onError as createErrorAfterware } from "@apollo/client/link/error";

interface createApolloClientProps {
  getToken: () => string;
  onUnauthorized: () => void;
}

function checkUnauthorizedMessage(graphQLErrors: GraphQLErrors) {
  return graphQLErrors.find(
    ({ message, path }) =>
      message === "Unauthorized" && !path?.includes("login")
  );
}

function createApolloClient({
  getToken,
  onUnauthorized,
}: createApolloClientProps) {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_API_URL,
    credentials: "same-origin",
  });

  const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const errorAfterware = createErrorAfterware(
    ({ graphQLErrors, networkError }) => {
      let hasUnauthorizedMessage = false;

      if (graphQLErrors) {
        if (checkUnauthorizedMessage(graphQLErrors)) {
          hasUnauthorizedMessage = true;
        } else {
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          );
        }
      }

      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }

      if (hasUnauthorizedMessage) {
        onUnauthorized();
      }
    }
  );

  const client = new ApolloClient({
    link: errorAfterware.concat(authLink.concat(httpLink)),
    cache: new InMemoryCache(),
  });

  return client;
}

export default createApolloClient;
