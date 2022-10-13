import React, { useState } from "react";

export function BetOption(props) {
  const [betAmount, setBetAmount] = useState(0);
  const [betSide, setBetSide] = useState(0);

  function handleSubmitBet(evt) {
    console.log("Bet amount:", betAmount);
    console.log("Bet Side:", betSide);
    alert("You have placed bet amount of: " + betAmount + " on: " + betSide + " for " + props.topic.topic);
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
      {questionList.map((question,i) => {
        return (
          <div className="view-item">
            <div className="topic-item" key = {i}>
              {Object.keys(question).slice(11).map((key, index) => {
                var value = question[key]
                if (key === "endDate") {
                  var endDate = new Date(value.toNumber())
                  value = endDate.toDateString()
                }
                else if(key === "minBet") {
                  value = value.toNumber() + " Wei"
                }
                else if(key === "comm") {
                  value = value.toNumber() + "%"
                }
                else if(key === "outcomes") {
                  value.map((side, index) => {
                    console.log(side)
                    return (
                      <p key={index}>
                        <span className="question-attr">
                          Side + {index}:
                        </span> &nbsp;{side}
                      </p>
                    );
                  })
                }
                return (
                  <p key={index}>
                    <span className="question-attr">
                      {key}:
                    </span> &nbsp;{value}
                  </p>
                );
              })}
            </div>
            <BetOption topic={question} />
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
