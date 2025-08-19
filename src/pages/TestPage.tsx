import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaTelegramPlane,
  FaInstagram,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function TestPage() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { options } = useSelector((state: RootState) => state.test);

  const [questions, setQuestions] = useState<any[]>([]);
  const [telegramClicked, setTelegramClicked] = useState(false);
  const [instagramClicked, setInstagramClicked] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [selectedLang, setSelectedLang] = useState<string>("uz");
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

  type Option = {
    id: number;
    types: string;
  };

  const optionsArray: Option[] =
    options && !Array.isArray(options)
      ? (Object.values(options) as Option[])
      : (options as Option[]);

  const LANG_OPTIONS = [
    { id: "uz", label: t("uzbek"), flag: "🇺🇿" },
    { id: "ru", label: t("russian"), flag: "🇷🇺" },
  ];

  // Progress calculation
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  useEffect(() => {
    if (!options || options.length === 0) {
      dispatch(fetchOptions(selectedLang));
    }
  }, [dispatch, options, selectedLang]);

  useEffect(() => {
    if (selectedBusinessId !== null) {
      dispatch(
        submitSelection({ businessId: selectedBusinessId, lang: selectedLang })
      )
        .unwrap()
        .then((res) => setQuestions(Array.isArray(res) ? res : []))
        .finally(() => setCurrentIndex(0));
    }
  }, [selectedBusinessId, selectedLang, dispatch]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answer });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    else setShowResult(true);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleAdviceClick = async () => {
    if (!telegramClicked || !instagramClicked) {
      setErrorMsg(t("error_subscribe"));
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
        body: JSON.stringify({ answers: answersArray, lang: selectedLang }),
      });

      const data = await res.json();
      setAdvice(data.advice || t("advice_not_found"));
      setShowAdvice(true);
    } catch (err) {
      setErrorMsg(t("error_occurred"));
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-6 flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100 opacity-20"
            style={{
              width: Math.random() * 200 + 50 + "px",
              height: Math.random() * 200 + 50 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Language and business selection modal */}
      <AnimatePresence>
        {showSelectModal && optionsArray?.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue/100 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {t("welcome_to_test")}
                </h2>
                <p className="text-gray-600">
                  {t("select_preferences_to_continue")}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {t("select_language")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {LANG_OPTIONS.map((lang) => (
                      <motion.button
                        key={lang.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedLang(lang.id)}
                        className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          selectedLang === lang.id
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {/* <span className="text-2xl mr-2">{lang.flag}</span> */}
                        <span>{lang.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    {t("select_business")}
                  </h3>
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full flex justify-between items-center bg-blue-600 text-white px-5 py-3 rounded-xl shadow-md hover:bg-blue-700 transition-all"
                    >
                      <span>
                        {selectedBusinessId !== null
                          ? optionsArray.find(
                              (opt) => opt.id === selectedBusinessId
                            )?.types
                          : t("choose_business")}
                      </span>
                      <FaChevronDown
                        className={`transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl z-50 overflow-auto max-h-60 border border-gray-200"
                        >
                          {optionsArray.map((opt) => (
                            <motion.button
                              key={opt.id}
                              onClick={() => {
                                setSelectedBusinessId(opt.id);
                                setDropdownOpen(false);
                              }}
                              whileHover={{ backgroundColor: "#EFF6FF" }}
                              className={`w-full text-left px-5 py-3 transition ${
                                selectedBusinessId === opt.id
                                  ? "bg-blue-50 text-blue-600 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {opt.types}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.button
                  disabled={selectedBusinessId === null || !selectedLang}
                  whileHover={{
                    scale:
                      selectedBusinessId !== null && selectedLang ? 1.03 : 1,
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowSelectModal(false);
                    if (selectedBusinessId !== null && selectedLang) {
                      dispatch(
                        submitSelection({
                          businessId: selectedBusinessId,
                          lang: selectedLang,
                        })
                      )
                        .unwrap()
                        .then((res) =>
                          setQuestions(Array.isArray(res) ? res : [])
                        )
                        .finally(() => setCurrentIndex(0));
                    }
                  }}
                  className={`w-full py-3 rounded-xl shadow-md text-white font-semibold transition ${
                    selectedBusinessId !== null && selectedLang
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {t("start_test")}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test questions */}
      {!showSelectModal && questions.length > 0 && !showResult && (
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden border border-gray-100"
        >
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
              initial={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Question counter */}
          <div className="text-sm text-gray-500 mb-2">
            {t("question")} {currentIndex + 1} {t("of")} {questions.length}
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
            {questions[currentIndex].question}
          </h2>

          {/* Answer options */}
          <div className="space-y-3 mb-8">
            {["option1", "option2", "option3"].map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(questions[currentIndex][key])}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center ${
                  selectedAnswers[currentIndex] === questions[currentIndex][key]
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-200 hover:border-blue-300"
                }`}
              >
                {selectedAnswers[currentIndex] ===
                questions[currentIndex][key] ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <FaCheck className="text-white text-xs" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                )}
                <span>{questions[currentIndex][key]}</span>
              </motion.button>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === 0}
              className={`px-5 py-2 rounded-lg flex items-center space-x-2 ${
                currentIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
            >
              <FaArrowLeft />
              <span>{t("previous")}</span>
            </motion.button>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedAnswers[currentIndex]}
              className={`px-5 py-2 rounded-lg flex items-center space-x-2 ${
                !selectedAnswers[currentIndex]
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              <span>
                {currentIndex === questions.length - 1
                  ? t("finish")
                  : t("next")}
              </span>
              <FaArrowRight />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Results section */}
      {showResult && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-2xl px-4 sm:px-6 mx-auto"
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white relative rounded-2xl md:rounded-3xl min-h-[400px] p-6 md:p-8 shadow-xl md:shadow-2xl text-center border border-gray-100"
    >
      {!showAdvice ? (
        <>
          {/* Success Header */}
          <div className="mb-6 md:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-10 md:w-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              {t("test_completed")}
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {t("thanks_for_completing")}
            </p>
          </div>

          {/* Social Media Buttons */}
          <div className="mb-6 md:mb-8">
            <p className="text-sm md:text-base text-gray-700 mb-3 md:mb-4">
              {t("subscribe_for_advice")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <motion.a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTelegramClicked(true)}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                  telegramClicked
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                <FaTelegramPlane className="text-lg" />
                <span>{t("telegram")}</span>
                {telegramClicked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </motion.a>

              <motion.a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setInstagramClicked(true)}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg ${
                  instagramClicked
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200"
                }`}
              >
                <FaInstagram className="text-lg" />
                <span>{t("instagram")}</span>
                {instagramClicked && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </motion.a>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm md:text-base text-red-500 mb-4"
            >
              {errorMsg}
            </motion.p>
          )}

          {/* Get Advice Button */}
          <motion.button
            onClick={handleAdviceClick}
            disabled={loadingAdvice || !telegramClicked || !instagramClicked}
            whileHover={{ scale: loadingAdvice ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full md:w-[90%] py-3 rounded-lg font-medium mt-4 md:absolute md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2 ${
              loadingAdvice
                ? "bg-gray-100 text-gray-500"
                : !telegramClicked || !instagramClicked
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {loadingAdvice ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>{t("getting_advice")}</span>
              </span>
            ) : (
              t("get_personalized_advice")
            )}
          </motion.button>
        </>
      ) : (
        /* Advice Display */
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {t("your_personalized_advice")}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {t("based_on_your_answers")}
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 md:p-6 text-left text-gray-700 whitespace-pre-line flex-grow overflow-y-auto max-h-[300px] md:max-h-[400px] text-sm md:text-base">
            {advice}
          </div>
          <button
            onClick={() => {
              setShowResult(false);
              setShowSelectModal(true);
              setSelectedBusinessId(null);
              setSelectedAnswers({});
              setCurrentIndex(0);
              setShowAdvice(false);
            }}
            className="mt-6 text-sm md:text-base text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("take_another_test")}
          </button>
        </div>
      )}
    </motion.div>
  </motion.div>
)}  
    </div>
  );
}
