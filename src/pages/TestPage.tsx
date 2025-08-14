import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function TestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { options, loading } = useSelector((state: RootState) => state.test);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [showResult, setShowResult] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const loadOptions = async () => {
      if (!options || options.length === 0)
        await dispatch(fetchOptions()).unwrap();
    };
    loadOptions();
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusinessId !== null) {
      const loadQuestions = async () => {
        try {
          const res = await dispatch(
            submitSelection(selectedBusinessId)
          ).unwrap();
          setQuestions(Array.isArray(res) ? res : []);
          setCurrentIndex(0);
        } catch {
          setQuestions([]);
        }
      };
      loadQuestions();
    }
  }, [selectedBusinessId, dispatch]);

  const handleAnswerSelect = (answer: string) =>
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  const handleNext = () =>
    currentIndex < questions.length - 1
      ? setCurrentIndex(currentIndex + 1)
      : setShowResult(true);
  const handlePrev = () =>
    currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const isSubscribed = () =>
    localStorage.getItem("telegram_subscribed") === "true";

  const renderAdvice = () =>
    isSubscribed() ? (
      <p className="mt-4 text-green-600 font-semibold text-lg">
        Bu yerda sizga mos maslahatlar chiqadi...
      </p>
    ) : (
      <p className="mt-4 text-red-600 font-semibold text-lg">
        Iltimos, Telegram kanalimizga obuna bo‘ling!
      </p>
    );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 via-pink-200 to-red-200">
        <p className="text-xl font-bold text-gray-700 animate-pulse">
          Loading...
        </p>
      </div>
    );

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  const handleBusinessSelect = (id: number) => {
    setSelectedBusinessId(id);
    setShowSelectModal(false);
  };

  return (
    <div className="h-screen relative bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-4 flex items-center justify-center">
      {/* SELECT MODAL */}
      <AnimatePresence>
        {showSelectModal && options.length > 0 && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col items-center relative"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Select a Business
              </h2>
              <div className="flex flex-col gap-4 w-full">
                {options.map((opt) => (
                  <motion.button
                    key={opt.id}
                    onClick={() => handleBusinessSelect(opt.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 font-semibold transition"
                  >
                    {opt.types}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TEST QUESTIONS */}
      {!showSelectModal && questions.length > 0 && (
        <div className="bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl relative overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {questions[currentIndex].question}
            </h2>
            <div className="flex flex-col gap-4">
              {["option1", "option2", "option3"].map((key) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    handleAnswerSelect(questions[currentIndex][key])
                  }
                  className={`border-2 p-4 rounded-xl text-left font-medium text-gray-700 transition-colors duration-300 shadow-md ${
                    selectedAnswers[currentIndex] ===
                    questions[currentIndex][key]
                      ? "bg-purple-500 text-white border-purple-600"
                      : "bg-white hover:bg-purple-100 border-gray-300"
                  }`}
                >
                  {questions[currentIndex][key]}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <motion.button
                onClick={handlePrev}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </motion.button>
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!selectedAnswers[currentIndex]}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 disabled:opacity-50"
              >
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </motion.button>
            </div>
            <div className="mt-6 h-4 w-full bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-4 bg-purple-500 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
