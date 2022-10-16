import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Add from "./routes/Add.js";
import ViewList from "./routes/View.js";
import Arbitrator from "./routes/Arbitrator.js";
import NavBar from "./NavBar.js";
import getBlockchain from "./ethereum.js";
import "./App.css";
import UserBets from "./routes/UserBets.js";

function App() {
  const [predictionMarket, setPredictionMarket] = useState(undefined);
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

  const handleAddTopic = async (evt) => {
    // createTopic(string memory topicID, string memory topic, string[] memory sides, uint64 deadline, 
    // uint256 minimum, uint256 commission, string memory description, address _arbitrator)
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

  const handleReportResult = async (uuid, winner) => {
    // reportResult(string memory topicID, string memory result
    try {
      await predictionMarket.reportResult(
        uuid,
        winner,
        {from: signerAddress}
      );

      // window.location.href = "/View";
      window.location.replace('/View');
    } catch (err) {
      console.log(err);
      alert("Unable to submit result!");
    }
  };

  function disableBetting(uuid, winner) {
    if (topicsList.find((x) => x.id === uuid)) {
      let newTopicsList =[...topicsList];
      let question = {...topicsList.find((x) => x.id === uuid)};
      question.finished = true;
      question.result = winner;
      const id = topicsList.findIndex((x) => x.id === uuid);
      newTopicsList[id] = question;
      setTopics(newTopicsList);
    }
  }

  const handlePlaceBet = async(uuid, side, amount) => {
    // function placeBet(string memory topicID, string memory side) public payable    
    try {
      await predictionMarket.placeBet(
        uuid,
        side,
        {from: signerAddress, value: amount}
      );
    } catch (err) {
      console.log(err);
      alert("Unable to place bet!");
    }
  };

  console.log("Signer:", signerAddress);
  console.log("Oracle:", oracleAddress);
  console.log("Questions on APP:", topicsList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<ViewList topicList={topicsList} placeBet={handlePlaceBet}/>} />
        <Route
          path="/Add"
          element={<Add topicList={topicsList} addTopic={handleAddTopic} signerAddress={signerAddress}/>}
        />
        <Route
          path="/View"
          element={<ViewList topicList={topicsList} placeBet={handlePlaceBet}/>}
        />
        <Route
          path="/Arbitrator"
          element={<Arbitrator topicList={topicsList} reportResult={handleReportResult} disableBetting={disableBetting} signer={signerAddress}/>}
        />
        <Route path = "/UserBets" element={<UserBets questionList={topicsList} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
