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
  // [{side: 'biden', amount: BigNumber}, {side: 'trump', amount: BigNumber}]
  return (
    <div className="topic-item">
      <form onSubmit={() => handleSubmitBet()}>
        <div className="bet-container">
          <label className="bet-item">
            Amount to bet (Wei):
            <input type="text" onChange={(event) => handleChange(event)} />
          </label>
          <div className="button-container">
            <button
              className="bet-button"
              type="submit"
              onClick={() => setBetSide(props.topic[0].side)}
            >
              Bet on {props.topic[0].side}
              <br></br>Current Pool:  {props.topic[0].amount.toNumber()}
            </button>
            <button
              className="bet-button"
              type="submit"
              onClick={() => setBetSide(props.topic[1].side)}
            >
              Bet on {props.topic[1].side}
              <br></br>Current Pool:  {props.topic[1].amount.toNumber()}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ClaimBetComponent(props) {

  function handleClick() {
    alert("You have collected your winnings for: " + props.topic.name + "!");
  }

  return (
    <div className="claim-container">
      <button onClick={handleClick} className="claim-button">
        CLAIM YOUR WINNINGS
      </button>
    </div>
  );
}

function ViewList(props) {

  const questionList = props.questionList;

 console.log("Questions on VIEW:", questionList);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Topics currently:</h2>
      {/* <div className="topic-container"> */}
      {questionList.map((question,i) => {
        console.log(question)
        // const keys = Object.keys(question = Object.fromEntries(Object.entries(question).filter(([k, v]) => isNaN(k))));
        const keys = Object.keys(question)
        return (
          <div className="view-item">
            <div className="topic-item" key = {i}>
              {keys.filter(function(k) {
                  if (k === "sides" || k === "id") {
                    return false; // skip
                  }
                return true;
              }).map((key, index) => {

                console.log(key)
                var value = question[key]
                console.log(value)
                if (key === "endDate") {
                  var endDate = new Date(0)
                  endDate.setUTCSeconds(value)
                  value = endDate.toString()
                  key = "Betting Close Date"
                }
                else if(key === "minBet") {
                  value = value + " Wei"
                  key = "Minimum Bet"
                }
                else if(key === "comm") {
                  value = value + "%"
                  key = "Commission"
                }
                else if(key === "outcomes") {
                  value = value.join(', ');
                  key = "Betting Outcomes"
                }
                else if(key === "name") {
                  key = "Topic Name"
                }
                else if(key === "desc") {
                  key = "Topic Description"
                }
                else if(key === "finished") {
                  if (value === false) value = 'No'
                  else value = 'Yes'
                  key = "Has Betting Ended?"
                }
                else if(key === "result") {
                  if (value === '') value = 'NA'
                  key = "Final Result"
                }
                return (
                  <p key={index}>
                    <span className="question-attr">{key}:</span> &nbsp;{value}
                  </p>
                );
              })}
            </div>

            {!question.finished ? (
              <BetOption topic={question.sides} />
            ) : (
              <div className="winner-container">
                WINNER:
                <span className="winner-text">{question.result}</span>
                <ClaimBetComponent topic = {question} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
