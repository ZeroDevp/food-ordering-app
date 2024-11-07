import React from "react";

const Loading = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div id="preloder">
        <div className="loader"></div>
      </div>
    );
  }
  return <>{children}</>;
};

export default Loading;
