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



  useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket } = await getBlockchain();
      const topics = await predictionMarket.getTopics();
      // setSignerAddress(signerAddress);
      
      //only for testing, to switch out with above 
      setSignerAddress("0x0b790B0d952b394a2c25076AD3e9984b8E3c6C19");
      setPredictionMarket(predictionMarket);
      setTopics(topics);
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


  //write function to retrieve QuestionList from Blockchain
  function retrieveTopics(){
    
  }

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

  console.log("Questions on APP:", topicsList[0]);

  // createTopic(string memory topicID, string memory topic, string[] memory sides, uint64 deadline, uint256 minimum, uint256 commission, string memory description, address _arbitrator)
  const handleAddTopic = async (evt) => {
    console.log(evt)
    try {
      await predictionMarket.createTopic(
        evt.uuid,
        evt.description,
        [evt.side1, evt.side2],
        1765217612,
        101,
        10,
        evt.description,
        signerAddress,
        {from: signerAddress}
      );
    } catch (err) {
      // if people reject, do something, add error box in the future?
      alert("Unable to add topic!");
    }
  };

  const handleAddQuestion = async (evt) => {
    setQuestion([...QuestionList, evt]);
  };

  console.log("Signer:", signerAddress);
  console.log("Questions on APP:", topicsList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<ViewList questionList={topicsList} />} />
        <Route
          path="/Add"
          element={<Add questionList={topicsList} addQuestion={handleAddTopic} signer={signerAddress}/>}
        />
        <Route
          path="/View"
          element={<ViewList questionList={topicsList} />}
        />
        <Route
          path="/Arbitrator"
          element={<Arbitrator questionList={topicsList} disableBetting={disableBetting} signer={signerAddress}/>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
