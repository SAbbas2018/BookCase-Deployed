import React, { useState, useContext } from "react";
import ErrorNotice from "./ErrorNotice";
import UserContext from "../context/UserContext";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import "../../src/App.css";
export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const [errorM, setError] = useState();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      //   const loginUser = { email, password };
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
    <div className="login-page">
      {/* <h3 className="page-title">Login</h3> */}
      {errorM && (
        <ErrorNotice message={errorM} clearError={() => setError(undefined)} />
      )}
      <form className="login-form" onSubmit={onSubmit}>
        <h3 className="page-title">Login</h3>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="form-control"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="btn btn-primary btn-lg btn-block"
            type="submit"
            value="Login"
          />
        </div>
      </form>
      <div className="card test-acc-container">
        <article className="card-body">
          <p className="card-title">
            <strong>Login Information for a Test Account.</strong>
          </p>
          <p className="card-text">Email: testaccount@mail.com</p>
          <p className="card-text">Password: testaccountpassword</p>
          <p className="card-text">
            Please copy and paste these into the login form if you wish to demo
            the app without creating an account.
          </p>
        </article>
      </div>
    </div>
  );
}
