import React, { useState } from "react";

function BetOption(props) {
  const [betAmount, setBetAmount] = useState(props.topic.minBet);
  const [betSide, setBetSide] = useState("");

  let side0 = parseInt(props.topic.sides[0].amount.toString());
  let side1 = parseInt(props.topic.sides[1].amount.toString());

  function dynamicWidth(side) {
    var perc;

    if (side === undefined || side === 0) {
      if (side0 === 0 && side1 === 0) {
        perc = 50;
      } else {
        perc = 0;
      }
    } else {
      perc = Math.round((side / (side0 + side1)) * 100);
    }
    return String(perc) + "%";
  }

  function barDisplay(curSide, oppSide) {
    if (curSide === 0 && oppSide !== 0) {
      return false;
    }
    return true;
  }

  const handleSubmitBet = async (e) => {
    e.preventDefault();
    console.log("Bet amount:", betAmount);
    console.log("Bet Side:", betSide);

    await props.placeBet(
      props.topic.id,
      betSide,
      (parseInt(betAmount) + 100).toString()
    );

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

  return (
    <div className="topic-item">
      {props.topic.endDate < Date.now() / 1000 ? (
        <div className="closedbet-container">Betting Closed</div>
      ) : (
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
            <p>
              Total bet amount (inclusive of fees): {Number(betAmount) + 100}{" "}
              Wei
            </p>
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
          </div>
        </form>
      )}
      <div className="gap-above gap-below bold">Current Pool:</div>
      <div className="row">
        <div className="bar-container">
          {barDisplay(side0, side1) ? (
            <div
              className="bar val-a"
              style={{
                flexBasis: dynamicWidth(side0),
              }}
            >
              <div className="align-left">
                {side0 === 0 ? (
                  0
                ) : (
                  <div>
                    {props.topic.sides[0].side}&nbsp;
                    {dynamicWidth(side0)}
                  </div>
                )}
              </div>
            </div>
          ) : null}
          {barDisplay(side1, side0) ? (
            <div
              className="bar val-b"
              style={{
                flexBasis: dynamicWidth(side1),
              }}
            >
              <div className="align-right">
                {side1 === 0 ? (
                  0
                ) : (
                  <div>
                    {props.topic.sides[1].side}&nbsp;
                    {dynamicWidth(side1)}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="gap-above">
        <p className="pool-amt">
          <div className="pool-amt-text">
            {props.topic.sides[0].side + ":"}&nbsp;
          </div>
          <span>{props.topic.sides[0].amount.toString()}</span>
        </p>
        <p className="pool-amt">
          <div className="pool-amt-text">
            {props.topic.sides[1].side + ":"}&nbsp;
          </div>
          <span>{props.topic.sides[1].amount.toString()}</span>
        </p>
      </div>
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
  let userBets = props.userBetsData;

  function claimable(topic) {
    var flag = 2;
    userBets.forEach((bet, i) => {
      if (bet.topicid === topic.id) {
        if (bet.side === topic.result) flag = 1;
        else flag = 0;
      }
    });
    return flag;
  }

  function renderSwitch(topic) {
    switch (claimable(topic)) {
      case 1:
        return <ClaimBetComponent topic={topic} claimBet={props.claimBet} />;
      case 2:
        return <div>No Bets placed!</div>;
      case 0:
        return <div>Unfortunately you did not place a winning bet :(</div>;
    }
  }

  console.log("Questions on VIEW:", topicList);

  return (
    <div className="parent-container">
      {topicList.map((topic, i) => {
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
                  } else if (key === "resolutionDate") {
                    var resolutionDate = new Date(0);
                    resolutionDate.setUTCSeconds(value);
                    value = resolutionDate.toString();
                    key = "Arbitrator Resolution Date";
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
                  } else if (key === "bettingclosed") {
                    if (value === false) value = "No";
                    else value = "Yes";
                    key = "Has Betting Ended?";
                  } else if (key === "reported") {
                    if (value === false) value = "No";
                    else value = "Yes";
                    key = "Has Arbitrator Reported?";
                  } else if (key === "result") {
                    if (value === "") value = "NA";
                    key = "Final Result";
                  } else if (key === "arb") {
                    key = "Arbitrator";
                  } else if (key === "isOwner") {
                    if (value) {
                      return <p>YOU ARE THE OWNER</p>;
                    } else {
                      return <p></p>;
                    }
                  } else {
                    return <p></p>;
                  }
                  return (
                    <p key={index}>
                      <span className="question-attr">{key}:</span> &nbsp;
                      {value}
                    </p>
                  );
                })}
            </div>
            {!topic.reported ? (
              <BetOption topic={topic} placeBet={props.placeBet} />
            ) : (
              <div className="winner-container">
                WINNER:
                <span className="winner-text">{topic.result}</span>
                {/* {claimable(topic) ? (
                  <ClaimBetComponent topic={topic} claimBet={props.claimBet} />
                ) : null} */}
                {renderSwitch(topic)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ViewList;
