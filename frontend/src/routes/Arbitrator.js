import React, { useState, useEffect } from "react";

function Arbitrator(props) {
  const [winner, setWinner] = useState(null);

  // add to blockchain
  function handleSubmit(event, question) {
    if (winner != question["outcomes"][0] && winner != question["outcomes"][1] ) {
      alert("Please select a valid result for: " + question.name);
    } else {
      event.preventDefault();
      // console.log("HELLLO:", winner);
      props.disableBetting(question.id, winner);
      props.reportResult(question.id, winner);
      alert("You have selected a winner for: " + question.name);
    }
  }

  console.log("WINNER", winner);

  const questionList = props.questionList;
  return (
    <div className="parent-container">
      <h2 className="addHeader">
        List of topics that you can resolve currently:
      </h2>
      {questionList.map((question, i) => {
        return (
          <div>
            {!question.finished && question.judge == props.signer? (
              <div className="abr-item">
                <div className="font-12">{question["name"]}</div>
                <div>
                  <select onChange={(e) => setWinner(e.target.value)}>
                    <option>-Select-</option>
                    <option value={question["outcomes"][0]}>
                      {question["outcomes"][0]}
                    </option>
                    <option value={question["outcomes"][1]}>
                      {question["outcomes"][1]}
                    </option>
                  </select>
                  <button
                    type="submit"
                    onClick={(evt) =>
                      handleSubmit(evt, question)
                    }
                    className="resolve-bet"
                  >
                    Submit Result
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default Arbitrator;
