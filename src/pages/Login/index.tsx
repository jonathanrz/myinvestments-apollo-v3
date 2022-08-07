import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

interface LoginProps {
  setToken: (token: string) => void;
}

function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [loginMutation, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (!data) return;

    const { login } = data;
    setToken(login);
    navigate("/", { replace: true });
  }, [data, setToken, navigate]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        loginMutation({ variables: { email, password } });
      }}
    >
      <div>
        <label>Email</label>
        <input
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "..." : "Login"}
      </button>
      {error && <div>{error.message}</div>}
    </form>
  );
}

export default Login;
