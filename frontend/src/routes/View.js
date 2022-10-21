import React, { useState } from "react";

function BetOption(props) {
  const [betAmount, setBetAmount] = useState(props.topic.minBet);
  const [betSide, setBetSide] = useState("");

  // const [sampleAmt1, setSampleAmt1] = useState(1000);
  // const [sampleAmt2, setSampleAmt2] = useState(60);

  console.log(props.topic.sides[0].amount.toNumber());

  function dynamicWidth(side) {
    var perc;

    if (side == undefined || side == 0) {
      perc = 0;
    } else {
      perc = Math.round(
        (side /
          (props.topic.sides[0].amount +
            props.topic.sides[1].amount.toNumber())) *
          100
      );
    }
    console.log("perc", String(perc) + "%");
    return String(perc) + "%";
  }

  const handleSubmitBet = async (e) => {
    e.preventDefault();
    console.log("Bet amount:", betAmount);
    console.log("Bet Side:", betSide);

    await props.placeBet(props.topic.id, betSide, betAmount);

    alert(
      "You have placed bet amount of " +
        betAmount +
        " Wei on: " +
        betSide +
        " for " +
        props.topic.name
    );
  };

  const handleChange = (evt) => {
    setBetAmount(evt.target.value);
  };

  // [{side: 'biden', amount: BigNumber}, {side: 'trump', amount: BigNumber}]
  return (
    <div className="topic-item">
      <form onSubmit={(e) => handleSubmitBet(e)}>
        <div className="bet-container">
          <label className="bet-item">
            Amount to bet (Wei):
            <input
              type="number"
              value={betAmount}
              min={props.topic.minBet}
              onChange={(event) => handleChange(event)}
            />
          </label>
          <p>Total bet amount (inclusive of fees): {Number(betAmount) + 100} Wei</p>
          <div className="button-container">
            <button
              className="bet-button side-1"
              type="submit"
              onClick={() => setBetSide(props.topic.sides[0].side)}
            >
              Bet on {props.topic.sides[0].side}
            </button>
            <button
              className="bet-button side-2"
              type="submit"
              onClick={() => setBetSide(props.topic.sides[1].side)}
            >
              Bet on {props.topic.sides[1].side}
            </button>
          </div>
          <div className="gap-above">Current Pool:</div>
          <div class="row">
            {/* <div class="label">Category Label</div> */}
            <div class="bar-container">
              <div
                class="bar val-a"
                style={{
                  "flex-basis": dynamicWidth(
                    props.topic.sides[0].amount.toNumber()
                  ),
                }}
              >
                <div className="align-left">
                  {props.topic.sides[0].amount.toNumber() == 0 ? 0 : (
                    <div>
                      {props.topic.sides[0].side}&nbsp;
                      {dynamicWidth(props.topic.sides[0].amount.toNumber())}
                    </div>
                  )}
                </div>
                {/* ) : null} */}
              </div>
              <div
                class="bar val-b"
                style={{
                  "flex-basis": dynamicWidth(
                    props.topic.sides[1].amount.toNumber()
                  ),
                }}
              >
                <div className="align-right">
                {props.topic.sides[1].amount.toNumber() == 0 ? 0 : (
                    <div>
                      {props.topic.sides[1].side}&nbsp;
                      {dynamicWidth(props.topic.sides[1].amount.toNumber())}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ClaimBetComponent(props) {
  const [claimed, setClaimed] = useState(false);

  function handleClick() {
    props.claimBet(props.topic.id);
    setClaimed(true);
    alert("You have collected your winnings for: " + props.topic.name + "!");
  }

  return (
    <div className="claim-container">
      {claimed === false ? (
        <button onClick={handleClick} className="claim-button">
          CLAIM YOUR WINNINGS
        </button>
      ) : null}
    </div>
  );
}

function ViewList(props) {
  const topicList = props.topicList;

  console.log("Questions on VIEW:", topicList);

  return (
    <div className="parent-container">
      <h2 className="addHeader">List of Topics currently:</h2>
      {/* <div className="topic-container"> */}
      {topicList.map((topic, i) => {
        console.log(topic);
        // const keys = Object.keys(topic = Object.fromEntries(Object.entries(topic).filter(([k, v]) => isNaN(k))));
        const keys = Object.keys(topic);
        return (
          <div className="view-item">
            <div className="topic-item" key={i}>
              {keys
                .filter(function (k) {
                  if (k === "sides" || k === "id") {
                    return false; // skip
                  }
                  return true;
                })
                .map((key, index) => {
                  var value = topic[key];
                  if (key === "endDate") {
                    var endDate = new Date(0);
                    endDate.setUTCSeconds(value);
                    value = endDate.toString();
                    key = "Betting Close Date";
                  } else if (key === "minBet") {
                    value = value + " Wei";
                    key = "Minimum Bet";
                  } else if (key === "comm") {
                    value = value + "%";
                    key = "Commission";
                  } else if (key === "outcomes") {
                    value = value.join(", ");
                    key = "Betting Outcomes";
                  } else if (key === "name") {
                    key = "Topic Name";
                  } else if (key === "desc") {
                    key = "Topic Description";
                  } else if (key === "finished") {
                    if (value === false) value = "No";
                    else value = "Yes";
                    key = "Has Betting Ended?";
                  } else if (key === "result") {
                    if (value === "") value = "NA";
                    key = "Final Result";
                  }
                  return (
                    <p key={index}>
                      <span className="question-attr">{key}:</span> &nbsp;
                      {value}
                    </p>
                  );
                })}
            </div>

            {!topic.finished ? (
              <BetOption topic={topic} placeBet={props.placeBet} />
            ) : (
              <div className="winner-container">
                WINNER:
                <span className="winner-text">{topic.result}</span>
                <ClaimBetComponent topic={topic} claimBet={props.claimBet} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
