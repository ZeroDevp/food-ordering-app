import React from "react";
import { NavLink } from "react-router-dom";

const ProductDetail = () => {
  return (
    <div className="container">
      <div className="row">
        <NavLink
          exact
          to="/Product"
          style={{ textDecoration: "none", color: "#333" }}
        >
          quay lai
        </NavLink>
      </div>
      <div className="row">
        <div className="col-md-6">asdasd</div>
        <div className="col-md-6">asdsasd</div>
      </div>
    </div>
  );
};

export default ProductDetail;
