import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Original from "./routes/Default.js";
import Add from "./routes/Add.js";
import ViewList from "./routes/View.js";
import Arbitrator from "./routes/Arbitrator.js";
import NavBar from "./NavBar.js";
import * as constants from "./constants.js";
import getBlockchain from "./ethereum.js";
import "./App.css";

function App() {
  const [predictionMarket, setPredictionMarket] = useState(undefined);
  const [QuestionList, setQuestion] = useState(constants.questionsSample);
  const [topicsList, setTopics] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)
  const [oracleAddress, setOracleAddress] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket, oracle } = await getBlockchain();
      const topics = await predictionMarket.getTopics();
      setSignerAddress(signerAddress);
      setOracleAddress(oracle);
      setPredictionMarket(predictionMarket);

      var topicPool = await predictionMarket.getTopicPool();
      // remove duplicated numerical keys due to await getter
      topicPool = topicPool.map(x => Object.fromEntries(Object.entries(x).filter(([k, v]) => isNaN(k))));
      // combine topics and topic pool into and array of dictionaries 
      var allTopics = topics.map(function(o, i) {
        var side = topicPool.find(function(o1) {return o1.id === o.id;}).pools
        return {
          id: o.id,
          name: o.name,
          desc: o.desc,
          outcomes: o.outcomes,
          endDate: o.endDate.toNumber(),
          minBet: o.minBet.toNumber(),
          comm: o.comm.toNumber(),
          judge: o.judge,
          finished: o.finished,
          result: o.result,
          // remove duplicated numerical keys due to await getter
          sides: side.map(x => Object.fromEntries(Object.entries(x).filter(([k, v]) => isNaN(k))))
        }
      });

      setTopics(allTopics)
    }
    init();
  }, []); 

  if (
    typeof predictionMarket === "undefined" ||
    typeof topicsList === "undefined" ||
    typeof signerAddress === "undefined"
  ) {
    return "Loading...";
  }

  

  // createTopic(string memory topicID, string memory topic, string[] memory sides, uint64 deadline, 
  // uint256 minimum, uint256 commission, string memory description, address _arbitrator)
  const handleAddTopic = async (evt) => {
    console.log(evt)

    // convert to epoch time
    const deadline =  Math.round(new Date(evt.deadline).getTime()/1000);

    // set arbitrator address
    var arbitrator = signerAddress;
    if (evt.arbitrator === 'Oracle'){
      arbitrator = oracleAddress;
    }
    

    try {
      await predictionMarket.createTopic(
        evt.uuid,
        evt.topic,
        [evt.side1, evt.side2],
        deadline,
        evt.minimumBet,
        evt.commission,
        evt.description,
        arbitrator,
        {from: signerAddress}
      );

      // window.location.href = "/View";
      window.location.replace('/View');
    } catch (err) {
      console.log(err);
      alert("Unable to add topic!");
    }
  };

  const handleAddQuestion = async (evt) => {
    setQuestion([...QuestionList, evt]);
  };


  console.log("Signer:", signerAddress);
  console.log("Oracle:", oracleAddress);
//  console.log("Questions on APP:", topicsList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<ViewList questionList={topicsList} />} />
        <Route
          path="/Add"
          element={<Add questionList={topicsList} addQuestion={handleAddTopic} signerAddress={signerAddress}/>}
        />
        <Route
          path="/View"
          element={<ViewList questionList={topicsList} />}
        />
        <Route path="/Arbitrator" element={<Arbitrator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
