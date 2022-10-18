import React, { useState, useEffect } from "react";

function UserBets(props) {
  const [userBets, setUserBets] = useState(undefined);
  //     useEffect(() => {
  //     const userBets = async () = {
  //         // const getUserBets = await props.predictionMarket.getUserBets(props.signer);
  //         // const topics = await predictionMarket.getUserBets();
  //         setUserBets(getUserBets);

  //     };userBets();

  //   },[])
  useEffect(() => {
    const init = async () => {
      const bets = await props.predictionMarket.getUserBets(props.signer);
      setUserBets(bets);
    };
    init();
  }, []);

  console.log("USER BETS:", userBets);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Bets that you have placed:</h2>
    </div>
  );
}

export default UserBets;
