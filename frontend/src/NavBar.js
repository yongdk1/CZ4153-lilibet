import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="navBar">
      <Link to="/Add" className="bar">
        <button className="bar">
          <div className="btn-text">Add Topic</div>
        </button>
      </Link>
      <Link to="/View" className="bar">
        <button className="bar">
          <div className="btn-text">View Topics</div>
        </button>
      </Link>
      <Link to="/Arbitrator" className="bar">
        <button className="bar">
          <div className="btn-text">Resolve Topic</div>
        </button>
      </Link>
    </div>
  );
};

export default NavBar;
