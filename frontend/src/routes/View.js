import React, { useState } from "react";

function BetOption(props) {
  const [betAmount, setBetAmount] = useState(0);
  const [betSide, setBetSide] = useState(0);

  // placeBet (blockchain, predictionMarket)
  function handleSubmitBet() {
    console.log("Bet amount:", betAmount);
    console.log("Bet Side:", betSide);
    alert(
      "You have placed bet amount of " +
        betAmount +
        " Wei on: " +
        betSide +
        " for " +
        props.topic.name
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
              onClick={() => setBetSide(props.topic.outcomes[0])}
            >
              Bet on {props.topic.outcomes[0]}
            </button>
            <button
              className="bet-button"
              type="submit"
              onClick={() => setBetSide(props.topic.outcomes[1])}
            >
              Bet on {props.topic.outcomes[1]}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ClaimBetComponent(props){
  
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
        // console.log();
        return (
          <div className="view-item">
            <div className="topic-item" key={i}>
              {Object.keys(
                (question = Object.fromEntries(
                  Object.entries(question).filter(([k, v]) => isNaN(k))
                ))
              ).map((key, index) => {
                // console.log("VIEW:", question);
                var value = question[key];
                if (key === "endDate") {
                  var endDate = new Date(0);
                  endDate.setUTCSeconds(value.toNumber());
                  value = endDate.toString();
                  key = "Betting Close Date";
                } else if (key === "minBet") {
                  value = value.toNumber() + " Wei";
                  key = "Minimum Bet";
                } else if (key === "comm") {
                  value = value.toNumber() + "%";
                  key = "Commission";
                } else if (key === "outcomes") {
                  value = value.join(", ");
                  key = "Betting Outcomes";
                } else if (key === "name") {
                  key = "Topic Name";
                } else if (key === "desc") {
                  key = "Topic Description";
                } else if (key === "finished") {
                  if (value == false) value = "No";
                  else value = "Yes";
                  key = "Has Betting Ended?";
                } else if (key === "result") {
                  if (value == false) value = "NA";
                  key = "Final Result";
                }
                return (
                  <p key={index}>
                    <span className="question-attr">{key}:</span> &nbsp;{value}
                  </p>
                );
              })}
            </div>
            {!question.finished ? (
              <BetOption topic={question} />
            ) : (
              <div className="winner-container">
                WINNER: &nbsp;
                <span className="winner-text">{question.result}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
