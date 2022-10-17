import React, { useState, useEffect } from "react";

function UserBets(props) {
  const [userBets, setUserBets] = useState(undefined);
  //   const userBets = async () => {
  //     try {
  //       await props.predictionMarket.getUserBets(props.signer);
  //     } catch (err) {
  //       console.log(err);
  //       alert("Unable to retrieve user bets!");
  //     }
  //   };
  //     useEffect(() => {
  //     const userBets = async () = {
  //         // const getUserBets = await props.predictionMarket.getUserBets(props.signer);
  //         // const topics = await predictionMarket.getUserBets();
  //         setUserBets(getUserBets);

  //     };userBets();

  //   },[])
  useEffect(() => {
    (async () => {
      const users = props.predictionMarket.getUserBets(props.signer);
      setUserBets(users);
    })});

  console.log("USER BETS:", userBets);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Bets that you have placed:</h2>
    </div>
  );
}

export default UserBets;
