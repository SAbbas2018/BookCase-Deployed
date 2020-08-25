import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Link } from "react-router-dom";
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
    setUserData({ token: undefined, user: undefined });
    localStorage.setItem("auth-token", "");
  };
  return (
    <div className="auth-buttons">
      {userData.user ? (
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link to="/">
              <button type="button" className="btn btn-info">
                Home
              </button>
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={logout} className="btn btn-info">
              Log Out
            </button>
          </li>
        </ul>
      ) : (
        // <div className="btn-group" role="group" aria-label="Basic example">
        //   <Link to="/">
        //     <button type="button" className="btn btn-info">
        //       Home
        //     </button>
        //   </Link>
        //   <button onClick={register} type="button" className="btn btn-info">
        //     Register
        //   </button>
        //   <button onClick={login} type="button" className="btn btn-info">
        //     Log In
        //   </button>
        // </div>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link to="/">
              <button type="button" className="btn btn-info">
                Home
              </button>
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={register} type="button" className="btn btn-info">
              Register
            </button>
          </li>
          <li className="nav-item">
            <button onClick={login} type="button" className="btn btn-info">
              Log In
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
