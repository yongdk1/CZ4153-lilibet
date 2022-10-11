import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Original from "./routes/Default.js";
import Add from "./routes/Add.js";
import ViewList from "./routes/View.js";
import Arbitrator from "./routes/Arbitrator.js";
import NavBar from "./NavBar.js";
import * as constants from "./constants.js";
import "./App.css";

function App() {
  const [QuestionList, setQuestion] = useState(constants.questionsSample);

  const handleAddQuestion = (evt) => {
    setQuestion([...QuestionList, evt]);
  };

  console.log("Questions on APP:", QuestionList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<Original />} />
        <Route
          path="/Add"
          element={<Add questionList={QuestionList} addQuestion={handleAddQuestion} />}
        />
        <Route
          path="/View"
          element={<ViewList questionList={QuestionList} />}
        />
        <Route path="/Arbitrator" element={<Arbitrator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
