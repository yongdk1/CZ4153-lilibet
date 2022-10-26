import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {

  const [curState, setCurState] = useState([false, false, false, false]);

  function handleClick(side){
    let newState = [false, false, false, false];
    newState[side] = true;
    setCurState(newState);
  }

  return (
    <div className="navBar">
      <Link to="/Add">
        <button className={curState[0] ? "bar-active" :"bar"} onClick={()=>handleClick(0)}>
          <div className="btn-text">Add Topic</div>
        </button>
      </Link>
      <Link to="/View">
        <button className={curState[1] ? "bar-active" :"bar"} onClick={()=>handleClick(1)}>
          <div className="btn-text">View Topics</div>
        </button>
      </Link>
      <Link to="/Arbitrator">
        <button className={curState[2] ? "bar-active" :"bar"} onClick={()=>handleClick(2)}>
          <div className="btn-text">Resolve Topic</div>
        </button>
      </Link>
      <Link to="/UserBets">
        <button className={curState[3] ? "bar-active" :"bar"} onClick={()=>handleClick(3)}>
          <div className="btn-text">Current Bets</div>
        </button>
      </Link>
    </div>
  );
};

export default NavBar;
