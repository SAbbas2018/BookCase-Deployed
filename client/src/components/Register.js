import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import ErrorNotice from "./ErrorNotice";
export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [errorM, setError] = useState();
  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { email, password, name };
      await Axios.post("/users/register", newUser);
      const loginRes = await Axios.post("/users/login", {
        email,
        password,
      });
      setUserData({ token: loginRes.data.token, user: loginRes.data.user });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (err) {
      if (err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };
  return (
    <div className="page">
      {errorM && (
        <ErrorNotice message={errorM} clearError={() => setError(undefined)} />
      )}
      <form className="register-form" onSubmit={onSubmit}>
        <h3 className="page-title">Register</h3>
        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            type="text"
            className="form-control"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="btn btn-primary btn-lg btn-block"
            type="submit"
            value="Register"
          />
        </div>
      </form>
    </div>
  );
}
