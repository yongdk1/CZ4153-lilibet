import React, { useState, useEffect } from "react";

function UserBets(props) {
  const [userBets, setUserBets] = useState([]);

  useEffect(() => {
    const init = async () => {
      let bets = await props.predictionMarket.getUserBets(props.signer);
      bets = bets.map((x) =>
        Object.fromEntries(Object.entries(x).filter(([k, v]) => isNaN(k)))
      );
      bets.map((bet) => {
        bet.amt = bet.amt.toString();
        bet.claimed = props.claimedBet.get(bet.topicid)
      })
      setUserBets(bets);
    };
    init();
  }, []);

  console.log("USER BETS:", userBets);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Bets that you have placed:</h2>
      {userBets.length > 0 ? 
      userBets.map((bet, i) => {
        return (
          <div className="view-item">
            <div className="topic-item">
              <p>
                <span className="question-attr">Topic Name:</span> &nbsp;
                {bet.topicid}
              </p>
              <p>
                <span className="question-attr">Bet Side:</span> &nbsp;
                {bet.side}
              </p>
              <p>
                <span className="question-attr">Bet Amount:</span> &nbsp;
                {bet.amt}
              </p>
              <p>
                <span className="question-attr">Claimed :</span> &nbsp;
                {bet.claimed.toString()}
              </p>
            </div>
          </div>
        );
      })
    : <h3> No Bets Placed</h3>}
    </div>
  );
}

export default UserBets;
