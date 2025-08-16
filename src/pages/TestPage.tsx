// TestPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaTelegramPlane } from "react-icons/fa";

export default function TestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { options } = useSelector((state: RootState) => state.test);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [showAdvice, setShowAdvice] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TELEGRAM_LINK = "https://t.me/testvibina";

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

  const checkTelegramSubscription = async () => {
    const user_id = Number(localStorage.getItem("telegram_user_id"));
    console.log(user_id);
    
    if (!user_id) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/check-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      return data.isSubscribed;
    } catch (err) {
      console.error("Telegram subscription check error:", err);
      return false;
    }
  };

  const handleTelegramClick = async () => {
    setErrorMsg("");
    const subscribed = await checkTelegramSubscription();

    if (subscribed) {
      const formattedAnswers = questions.map((q, index) => ({
        question: q.question,
        userAnswer: selectedAnswers[index] || "Javob berilmagan",
      }));

      try {
        const res = await fetch(`${API_BASE_URL}/ai`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: formattedAnswers }),
        });
        const data = await res.json();
        setShowAdvice(true);
        console.log("AI javobi:", data.advice || data.error);
      } catch (error) {
        console.error("AI bilan aloqa xatosi:", error);
        setErrorMsg("Maslahatlarni olishda xato yuz berdi");
      }
    } else {
      setErrorMsg("Iltimos, Telegram kanalimizga obuna bo‘ling!");
    }
  };

  const handleSelectConfirm = () => {
    if (selectedBusinessId !== null) {
      setShowSelectModal(false);
      dispatch(submitSelection(selectedBusinessId));
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Select a Business</h2>
              <div className="w-full relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex justify-between items-center bg-purple-500 text-white px-4 py-3 rounded-xl shadow-md hover:bg-purple-600 transition-all">
                  {selectedBusinessId
                    ? options.find((opt) => opt.id === selectedBusinessId)?.types
                    : "Choose business"}
                  <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
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
                        <motion.button key={opt.id} onClick={() => { setSelectedBusinessId(opt.id); setDropdownOpen(false); }}
                          whileHover={{ scale: 1.03, backgroundColor: "#EDE9FE" }}
                          className={`w-full text-left px-4 py-3 transition-all ${selectedBusinessId === opt.id ? "bg-purple-200 font-semibold" : ""}`}>
                          {opt.types}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button disabled={selectedBusinessId === null} onClick={handleSelectConfirm}
                className={`mt-6 w-full px-6 py-3 rounded-xl shadow-md text-white font-semibold transition ${selectedBusinessId ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 cursor-not-allowed"}`}>
                Tanlash
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSelectModal && questions.length > 0 && !showResult && (
        <div className="bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl relative overflow-hidden">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{questions[currentIndex].question}</h2>
            <div className="flex flex-col gap-4">
              {["option1", "option2", "option3"].map((key) => (
                <motion.button key={key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSelect(questions[currentIndex][key])}
                  className={`border-2 p-4 rounded-xl text-left font-medium text-gray-700 transition-colors duration-300 shadow-md ${selectedAnswers[currentIndex] === questions[currentIndex][key] ? "bg-purple-500 text-white border-purple-600" : "bg-white hover:bg-purple-100 border-gray-300"}`}>
                  {questions[currentIndex][key]}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between mt-8">
              <motion.button onClick={handlePrev} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={currentIndex === 0}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl shadow-md hover:bg-gray-300 disabled:opacity-50">
                Previous
              </motion.button>
              <motion.button onClick={handleNext} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={!selectedAnswers[currentIndex]}
                className="px-6 py-3 bg-purple-500 text-white rounded-xl shadow-md hover:bg-purple-600 disabled:opacity-50">
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {showResult && (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-100 via-pink-100 to-red-100 p-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl flex flex-col items-center">
            <h1 className="text-4xl font-extrabold mb-6 text-purple-700">Test Completed</h1>

            <div className="relative w-52 h-52 mb-6">
              <svg height={200} width={200}>
                <circle stroke="#e5e7eb" fill="transparent" strokeWidth={12} r={88} cx={100} cy={100} />
                <motion.circle fill="transparent" strokeWidth={12} strokeLinecap="round" r={88} cx={100} cy={100} transform={`rotate(-90 100 100)`} initial={{ strokeDashoffset: 553 }} animate={{ strokeDashoffset: 553 - (calculateScore() / 100) * 553, stroke: calculateScore() <= 30 ? "#f87171" : calculateScore() <= 60 ? "#facc15" : "#34d399" }} transition={{ duration: 1.5, ease: "linear" }} strokeDasharray="553" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-purple-600">{calculateScore()}%</span>
              </div>
            </div>

            <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer">
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition font-semibold text-lg mb-4">
                <FaTelegramPlane /> Telegram Kanal
              </button>
            </a>

            <button onClick={handleTelegramClick} className="px-6 py-3 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition font-semibold text-lg">
              Maslahat
            </button>

            {errorMsg && <p className="text-red-600 font-semibold mt-2">{errorMsg}</p>}
            {showAdvice && <p className="text-green-600 font-semibold mt-2 text-center">Bu yerda sizga mos maslahatlar chiqadi...</p>}
          </motion.div>
        </div>
      )}
    </div>
  );
}
