import React from "react";

function ErrorNotice(props) {
  return (
    <div className="error-notice alert alert-danger" role="alert">
      <p className="error-notice-message">{props.message}</p>
      <button
        className="error-notice-button btn btn-danger"
        onClick={props.clearError}
      >
        X
      </button>
    </div>
  );
}

export default ErrorNotice;
