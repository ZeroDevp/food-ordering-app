// import React from "react";

// const Loading = ({ isLoading, children }) => {
//   if (isLoading) {
//     return (
//       <div id="preloder">
//         <div className="loader"></div>
//       </div>
//     );
//   }
//   return <>{children}</>;
// };

// export default Loading;

import React from "react";
import { Spin } from "antd";

const Loading = ({ isLoading, children }) => {
  return isLoading ? (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Spin size="large" />
    </div>
  ) : (
    children
  );
};

export default Loading;
