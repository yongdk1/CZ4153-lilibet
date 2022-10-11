import React, { useState } from "react";

export function BetOption(props) {
  const [betAmount, setBetAmount] = useState(0);
  const [betSide, setBetSide] = useState(0);


  // placeBet (blockchain, predictionMarket)
  function handleSubmitBet(evt) {
    console.log("Bet amount:", betAmount);
    console.log("Bet Side:", betSide);
    alert(
      "You have placed bet amount of: " +
        betAmount +
        " on: " +
        betSide +
        " for " +
        props.topic.topic
    );
  }

  const handleChange = (evt) => {
    setBetAmount(evt.target.value);
  };

  return (
    <div className="topic-item">
      <form onSubmit={() => handleSubmitBet()}>
        <div className="bet-container">
          <label className="bet-item">
            Amount to bet:
            <input type="text" onChange={(event) => handleChange(event)} />
          </label>
          <div className="button-container">
            <button
              className="bet-button"
              type="submit"
              onClick={() => setBetSide(props.topic.side1)}
            >
              Bet on {props.topic.side1}
            </button>
            <button
              className="bet-button"
              type="submit"
              onClick={() => setBetSide(props.topic.side2)}
            >
              Bet on {props.topic.side2}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ViewList(props) {
  const questionList = props.questionList;

  // console.log("Questions on VIEW:", questionList);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Topics currently:</h2>
      {/* <div className="topic-container"> */}
      {questionList.map((question, i) => {
        // console.log("WINNER:", question.winner);
        return (
          <div className="view-item">
            <div className="topic-item" key={i}>
              {Object.keys(question)
                .slice(1, -1)
                .map((key, index) => {
                  return (
                    <p key={index}>
                      <span className="question-attr">{key}:</span> &nbsp;
                      {question[key]}
                      {question.value}
                    </p>
                  );
                })}
            </div>
            {question.show ? <BetOption topic={question} /> : <div className="winner-container">WINNER: &nbsp; {question.winner}</div>}
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
