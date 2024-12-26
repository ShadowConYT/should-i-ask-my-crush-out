import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentNode, setCurrentNode] = useState("start");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("/LeoDas.json")
      .then((res) => res.json())
      .then((data) => setQuestionnaire(data))
      .catch(() => setError("Error loading data"));
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const currentQuestion = questionnaire[currentNode];

  return (
    <div className={`min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 p-4 transition-colors duration-300`}>
      <div className="absolute top-4 right-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="bg-indigo-600 dark:bg-indigo-400 text-white dark:text-gray-900 rounded-full p-2 shadow-lg"
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </motion.button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNode}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full"
          >
            {currentQuestion.question && (
              <h2 className="text-3xl font-bold text-center text-indigo-700 dark:text-indigo-300 mb-6">
                {currentQuestion.question}
              </h2>
            )}

            {selectedAnswer && (
              <p className="text-lg text-center text-green-600 dark:text-green-400 mb-6">
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
                    className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg w-full"
                    onClick={() => handleOptionClick(key)}
                  >
                    {key}
                  </motion.button>
                ))
              ) : (
                <p className="text-xl text-center text-gray-700 dark:text-gray-300 mt-4">
                  {currentQuestion.answer}
                </p>
              )}
            </div>

            {history.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-full text-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-md w-full"
                onClick={oneStepBack}
              >
                Go Back
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center py-4">
        <h1 className="text-lg text-gray-700 dark:text-gray-300">
          Made with ❤️ by <a href="https://ajay06.netlify.app" className="font-semibold text-indigo-400" target="_blank">{"Ajay"}</a> <i>(I am Single tho... 😅)</i>
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Ajay. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default App;