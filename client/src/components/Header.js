import React from "react";
//needed to make button links to routes
// import { Link } from "react-router-dom";
import AuthOptions from "./AuthOptions";
export default function Header() {
  return (
    <div className="header bg-light">
      <div className="header-logo">
        <i className="header-logo-item fas fa-book-open fa-2x"></i>
        <i className="header-logo-item fas fa-book fa-2x" alt="book-Logo"></i>
        <i className="header-logo-item fas fa-suitcase fa-2x"></i>
      </div>
      <h2 className="header-title">BookCase</h2>
      <AuthOptions />
    </div>
  );
}
