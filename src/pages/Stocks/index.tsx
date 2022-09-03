import React from "react";
import { Navigate } from "react-router-dom";
import Content from "./Content";

interface MainProps {
  token?: string;
}

function Main({ token }: MainProps) {
  if (!token) {
    return <Navigate to="/login" replace={true} />;
  }

  return <Content />;
}

export default Main;
