import React,{useState,useEffect} from "react";

function Arbitrator(props) {

  const [winner,setWinner] = useState(null);


  // add to blockchain
  function handleSubmit(event,uuid){
    event.preventDefault();
    console.log("HELLLO:", winner);
    props.disableBetting(uuid,winner);
    alert("Winner:", winner);
  }

  console.log("WINNER",winner);

  const questionList = props.questionList;
  return (
    <div className="parent-container">
      <h2 className="addHeader">
        List of topics that you can resolve currently:
      </h2>
      {questionList.map((question, i) => {
        return (
          <div className="abr-item">
            <div className="font-12">{question.topic}</div>
            <div>
            {/* onChange={(e) => setWinner(e.target.value)} */}
              <select onChange={(e) => setWinner(e.target.value)} >
                <option value={question.side1}>{question.side1}</option>
                <option value={question.side2}>{question.side2}</option>
              </select>
              <button type="submit" onClick = {(evt)=>handleSubmit(evt,question.uuid)} className="resolve-bet">
                Submit Result
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Arbitrator;
