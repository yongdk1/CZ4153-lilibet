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

  useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket } = await getBlockchain();
      const topics = await predictionMarket.getTopics();
      setPredictionMarket(predictionMarket)
      setTopics(topics)
    }
    init();
  }, []); 

  if (
    typeof predictionMarket === "undefined" ||
    typeof topicsList === "undefined"
  ) {
    return "Loading...";
  }

  const handleAddQuestion = (evt) => {
    setQuestion([...QuestionList, evt]);
  };

  console.log("Questions on APP:", topicsList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<ViewList questionList={topicsList} />} />
        <Route
          path="/Add"
          element={<Add questionList={QuestionList} addQuestion={handleAddQuestion} />}
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
