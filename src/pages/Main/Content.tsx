import React from "react";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_INVESTMENTS = gql`
  {
    investments {
      uuid
      name
      type
      holder
      objective
      incomes {
        uuid
        date
        yield
        received
        value
      }
    }
  }
`;

function Content() {
  const { loading, error, data } = useQuery(GET_ALL_INVESTMENTS);

  console.log({ data });

  return (
    <div>
      {loading && "Loading..."}
      {error && error.message}
      Blah
    </div>
  );
}

export default Content;
