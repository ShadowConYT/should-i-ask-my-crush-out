import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentNode, setCurrentNode] = useState("start");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/LeoDas.json")
      .then((res) => res.json())
      .then((data) => setQuestionnaire(data))
      .catch(() => setError("Error loading data"));
  }, []);

  const handleOptionClick = (optionKey) => {
    const node = questionnaire[currentNode];
    const nextNodeKey = node.options?.[optionKey]?.next_node;

    if (!nextNodeKey || !questionnaire[nextNodeKey]) {
      console.error("Invalid next_node or missing node:", nextNodeKey);
      alert("End of the questionnaire or invalid path.");
      return;
    }

    setHistory((prevHistory) => [...prevHistory, currentNode]);
    setSelectedAnswer(node.options[optionKey]?.answer || "");
    setCurrentNode(nextNodeKey);
  };

  const oneStepBack = () => {
    if (history.length === 0) {
      alert("You are at the start. Cannot go back further.");
      return;
    }

    const previousNode = history.pop();
    setHistory([...history]);
    setSelectedAnswer("");
    setCurrentNode(previousNode);
  };

  if (!questionnaire) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  const currentQuestion = questionnaire[currentNode];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full"
        >
          {currentQuestion.question && (
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
              {currentQuestion.question}
            </h2>
          )}

          {selectedAnswer && (
            <p className="text-lg text-center text-green-600 mb-6">
              {selectedAnswer}
            </p>
          )}

          <div className="flex flex-col space-y-4">
            {currentQuestion.options ? (
              Object.entries(currentQuestion.options).map(([key, option]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-full"
                  onClick={() => handleOptionClick(key)}
                >
                  {key}
                </motion.button>
              ))
            ) : (
              <p className="text-xl text-center text-gray-700 mt-4">
                {currentQuestion.answer}
              </p>
            )}
          </div>

          {history.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md w-full"
              onClick={oneStepBack}
            >
              Go Back
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;

