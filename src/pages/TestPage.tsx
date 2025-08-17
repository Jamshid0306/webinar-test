// TestPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaTelegramPlane, FaInstagram } from "react-icons/fa";

export default function TestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { options } = useSelector((state: RootState) => state.test);

  const [questions, setQuestions] = useState<any[]>([]);
  const [telegramClicked, setTelegramClicked] = useState(false);
  const [instagramClicked, setInstagramClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});

  const [showResult, setShowResult] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [advice, setAdvice] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TELEGRAM_LINK = "https://t.me/ravshanpulatjon";
  const INSTAGRAM_LINK =
    "https://www.instagram.com/ravshan_pulatjon?igsh=ano5ZWRzc2Z6eDV4";

  useEffect(() => {
    if (!options || options.length === 0) dispatch(fetchOptions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusinessId !== null) {
      dispatch(submitSelection(selectedBusinessId))
        .unwrap()
        .then((res) => setQuestions(Array.isArray(res) ? res : []))
        .finally(() => setCurrentIndex(0));
    }
  }, [selectedBusinessId, dispatch]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };
  const handleSubmit = async () => {
    try {
      const answersArray = Object.entries(selectedAnswers).map(
        ([index, userAnswer]) => ({
          question: questions[Number(index)].question,
          userAnswer,
        })
      );

      const response = await fetch("http://127.0.0.1:8000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await response.json();
      console.log("Backend javobi:", data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleAdviceClick = async () => {
    if (!telegramClicked || !instagramClicked) {
      setErrorMsg(
        "Iltimos, avval Telegram va Instagram kanalimizga obuna bo'ling!"
      );
      return;
    }

    setLoadingAdvice(true);
    setErrorMsg("");

    try {
      const answersArray = Object.entries(selectedAnswers).map(
        ([index, userAnswer]) => ({
          question: questions[Number(index)].question,
          userAnswer,
        })
      );

      const res = await fetch(`${API_BASE_URL}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArray }),
      });

      const data = await res.json();
      setAdvice(data.advice || "Maslahat topilmadi");
      setShowAdvice(true);
    } catch (err) {
      setErrorMsg("Xatolik yuz berdi!");
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="h-screen relative bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-4 flex items-center justify-center">
      <AnimatePresence>
        {showSelectModal && options.length > 0 && (
          <motion.div
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
              <div className="w-full relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex justify-between items-center bg-purple-500 text-white px-4 py-3 rounded-xl shadow-md hover:bg-purple-600 transition-all"
                >
                  {selectedBusinessId
                    ? options.find((opt) => opt.id === selectedBusinessId)
                        ?.types
                    : "Choose business"}
                  <FaChevronDown
                    className={`transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg z-50 overflow-auto max-h-[400px]"
                    >
                      {options.map((opt) => (
                        <motion.button
                          key={opt.id}
                          onClick={() => {
                            setSelectedBusinessId(opt.id);
                            setDropdownOpen(false);
                          }}
                          whileHover={{
                            scale: 1.03,
                            backgroundColor: "#EDE9FE",
                          }}
                          className={`w-full text-left px-4 py-3 transition-all ${
                            selectedBusinessId === opt.id
                              ? "bg-purple-200 font-semibold"
                              : ""
                          }`}
                        >
                          {opt.types}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                disabled={selectedBusinessId === null}
                onClick={() => setShowSelectModal(false)}
                className={`mt-6 w-full px-6 py-3 rounded-xl shadow-md text-white font-semibold transition ${
                  selectedBusinessId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Tanlash
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSelectModal && questions.length > 0 && !showResult && (
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
          </motion.div>
        </div>
      )}

      {showResult && (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col items-center"
          >
            <h1 className="text-4xl font-extrabold mb-6 text-purple-700">
              Test yakunlandi!
            </h1>

            {!showAdvice ? (
              <>
                <div className="flex flex-col text-center items-center gap-5 mb-4">
                  <p>
                    Maslahat olish uchun telegram va instagram sahifamizga obuna
                    boling
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setTelegramClicked(true)}
                    >
                      <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2">
                        <FaTelegramPlane /> <span>Telegram</span>
                      </button>
                    </a>
                    <a
                      href={INSTAGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setInstagramClicked(true)}
                    >
                      <button className="bg-pink-500 text-white px-4 py-2 rounded flex items-center space-x-2">
                        <FaInstagram /> <span>Instagram</span>
                      </button>
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleAdviceClick}
                  disabled={loadingAdvice}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition font-semibold text-lg"
                >
                  {loadingAdvice ? "Maslahatlar olinmoqda..." : "Maslahat olish"}
                </button>
                {errorMsg && (
                  <p className="text-red-600 font-semibold mt-2 text-center">
                    {errorMsg}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-green-600 font-semibold mt-4 text-center">
                  {advice}
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setShowAdvice(false);
                    setAdvice(null);
                    setSelectedAnswers({});
                    setCurrentIndex(0);
                    setTelegramClicked(false);
                    setInstagramClicked(false);
                  }}
                  className="mt-6 px-6 py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 transition font-semibold text-lg"
                >
                  Qaytadan urinish
                </button>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
