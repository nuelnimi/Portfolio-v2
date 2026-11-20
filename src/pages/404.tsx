import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div>
      <h1>Page not found</h1>
      <p>Page does not exist</p>
      <Link to={"/"}> Back to home page </Link>
    </div>
  );
};

export default Error;
