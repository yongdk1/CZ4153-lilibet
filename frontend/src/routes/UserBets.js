import React, { useState, useEffect } from "react";

function UserBets(props) {
  const [userBets, setUserBets] = useState(undefined);

  const sampleBets = [
    {
      name: "yayaya",
      user: "me",
      side: "biden",
      amt: "1000",
      claimed: false,
    },
    {
      name: "papaya",
      user: "me",
      side: "trump",
      amt: "2000",
      claimed: false,
    },
  ];

  useEffect(() => {
    const init = async () => {
      let bets = await props.predictionMarket.getUserBets(props.signer);
      bets = bets.map((x) =>
        Object.fromEntries(Object.entries(x).filter(([k, v]) => isNaN(k)))
      );
      setUserBets(bets);
    };
    init();
  }, []);

  // bets = [{}, {}];

  console.log("USER BETS:", userBets);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Bets that you have placed:</h2>

      {sampleBets.map((bet, i) => {
        return (
          <div className="view-item">
            <div className="topic-item">
              <p>
                <span className="question-attr">Topic Name:</span> &nbsp;
                {bet.name}
              </p>
              <p>
                <span className="question-attr">Bet Side:</span> &nbsp;
                {bet.side}
              </p>
              <p>
                <span className="question-attr">Bet Amount:</span> &nbsp;
                {bet.amt}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserBets;
