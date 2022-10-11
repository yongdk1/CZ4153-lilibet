import React, { useState, useCallback } from "react";
import { useBetween } from "use-between";
import * as constants from "./constants.js";

// const SharedQuestionList = () => {
//   const [Questions, setQuestion] = useState(constants.questionsSample);
//   const addQuestion = useCallback((evt) =>
//     setQuestion({
//       Questions: [...Questions, evt],
//     })
//   );
//   return { Questions, addQuestion };
// };

// export default useSharedQuestions = () => useBetween(SharedQuestionList);
