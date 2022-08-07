import React from "react";
import { Navigate } from "react-router-dom";

interface MainProps {
  token?: string;
}

function Main({ token }: MainProps) {
  console.log({ token });

  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return <div>Main</div>;
}

export default Main;
