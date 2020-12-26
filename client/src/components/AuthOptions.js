import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";
import { updateTestAcc } from "../testAccountUpdate.js";
export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();
  const register = () => {
    history.push("/register");
  };
  const login = () => {
    history.push("/login");
  };
  const logout = () => {
    updateTestAcc(userData);
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
  };
  return (
    <div className="auth-buttons">
      {userData.user ? (
        <div className="nav auth-nav">
          <div className="nav-item">
            <Link to="/">
              <button type="button" className="btn btn-info">
                Home
              </button>
            </Link>
          </div>
          <div className="nav-item">
            <button onClick={logout} className="btn btn-info">
              Log Out
            </button>
          </div>
        </div>
      ) : (
        <div className="nav auth-nav">
          <div className="nav-item">
            <Link to="/">
              <button type="button" className="btn btn-info">
                Home
              </button>
            </Link>
          </div>
          <div className="nav-item">
            <button onClick={register} type="button" className="btn btn-info">
              Register
            </button>
          </div>
          <div className="nav-item">
            <button onClick={login} type="button" className="btn btn-info">
              Log In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
