import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaTelegramPlane, FaInstagram } from "react-icons/fa";
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

  const LANG_OPTIONS = [
    { id: "uz", label: t("uzbek") },
    { id: "ru", label: t("russian") },
  ];

  useEffect(() => {
    i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  useEffect(() => {
    if (!options || options.length === 0) dispatch(fetchOptions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedBusinessId !== null) {
      dispatch(
        submitSelection({
          businessId: selectedBusinessId!,
          lang: selectedLang!,
        })
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
        body: JSON.stringify({ answers: answersArray, lang: selectedLang }), // <--- tilni yuboramiz
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
    <div className="min-h-screen relative bg-gradient-to-r from-purple-200 via-pink-100 to-red-200 p-4 md:p-6 flex items-center justify-center">
      {/* Til va biznes tanlash modal */}
      <AnimatePresence>
        {showSelectModal && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: -50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-white to-purple-50 rounded-2xl md:rounded-3xl p-6 md:p-8 w-[95%] sm:w-[90%] md:w-full max-w-md shadow-2xl flex flex-col items-center"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-purple-700 text-center">
              {t("select_language")}
              </h2>
              <div className="flex gap-4 mb-6">
                {LANG_OPTIONS.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLang(lang.id)}
                    className={`px-4 py-2 rounded-xl border-2 ${
                      selectedLang === lang.id
                        ? "bg-purple-200 border-purple-500"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-purple-700 text-center">
                {t("select_business")}
              </h2>
              <div className="w-full relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex justify-between items-center bg-purple-500 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg hover:bg-purple-600 transition-all text-base md:text-lg"
                >
                  {selectedBusinessId
                    ? options.find((opt) => opt.id === selectedBusinessId)
                        ?.types
                    : t("choose_business")}
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
                      className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl md:rounded-2xl shadow-xl z-50 overflow-auto max-h-[250px] md:max-h-[350px] border border-purple-100"
                    >
                      {options.map((opt) => (
                        <motion.button
                          key={opt.id}
                          onClick={() => {
                            setSelectedBusinessId(opt.id);
                            setDropdownOpen(false);
                          }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "#F3E8FF",
                          }}
                          className={`w-full text-left px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl transition text-sm md:text-base ${
                            selectedBusinessId === opt.id
                              ? "bg-purple-200 font-semibold"
                              : "hover:bg-purple-50"
                          }`}
                        >
                          {opt.types}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                disabled={!selectedBusinessId || !selectedLang}
                whileHover={{
                  scale: selectedBusinessId && selectedLang ? 1.05 : 1,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSelectModal(false);
                  if (selectedBusinessId && selectedLang) {
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
                className={`mt-5 md:mt-6 w-full px-5 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-md text-white font-semibold text-base md:text-lg transition ${
                  selectedBusinessId && selectedLang
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {t("start")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test savollari */}
      {!showSelectModal && questions.length > 0 && !showResult && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-white to-purple-50 rounded-2xl md:rounded-3xl p-6 md:p-10 w-[95%] sm:w-[90%] md:w-full max-w-3xl shadow-2xl relative overflow-hidden"
        >
          <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-gray-800 mb-4 md:mb-6 text-center">
            {questions[currentIndex].question}
          </h2>
          <div className="flex flex-col gap-3 md:gap-4">
            {["option1", "option2", "option3"].map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswerSelect(questions[currentIndex][key])}
                className={`border-2 p-3 md:p-4 rounded-xl md:rounded-2xl text-left font-medium text-base md:text-lg transition-colors duration-300 shadow-md ${
                  selectedAnswers[currentIndex] === questions[currentIndex][key]
                    ? "bg-purple-500 text-white border-purple-600 shadow-lg"
                    : "bg-white hover:bg-purple-100 border-gray-300"
                }`}
              >
                {questions[currentIndex][key]}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mt-6 md:mt-8">
            <motion.button
              onClick={handlePrev}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={currentIndex === 0}
              className="flex-1 px-5 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 rounded-xl md:rounded-2xl shadow-md hover:bg-gray-300 disabled:opacity-50 text-sm md:text-base"
            >
              {t("previous")}
            </motion.button>
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!selectedAnswers[currentIndex]}
              className="flex-1 px-5 md:px-6 py-2.5 md:py-3 bg-purple-500 text-white rounded-xl md:rounded-2xl shadow-md hover:bg-purple-600 disabled:opacity-50 text-sm md:text-base"
            >
              {currentIndex === questions.length - 1 ? t("finish") : t("next")}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Natija */}
      {showResult && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6"
        >
          <motion.div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 w-[95%] sm:w-[90%] md:w-full max-w-[600px] shadow-2xl flex flex-col items-center text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-6 text-purple-700">
              {t("test_completed")}
            </h1>

            {!showAdvice ? (
              <>
                <p className="mb-4 md:mb-6 text-gray-700 font-medium text-sm md:text-base">
                  {t("advice_prompt")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6 w-full sm:w-auto">
                  <a
                    href={TELEGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setTelegramClicked(true)}
                    className="flex-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-500 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <FaTelegramPlane /> <span>{t("telegram")}</span>
                    </motion.button>
                  </a>
                  <a
                    href={INSTAGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setInstagramClicked(true)}
                    className="flex-1"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-pink-500 text-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
                    >
                      <FaInstagram /> <span>{t("instagram")}</span>
                    </motion.button>
                  </a>
                </div>
                {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
                <motion.button
                  onClick={handleAdviceClick}
                  disabled={loadingAdvice}
                  whileHover={{ scale: loadingAdvice ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl shadow-md hover:bg-green-600 disabled:opacity-50 text-sm md:text-base"
                >
                  {loadingAdvice ? t("getting_advice") : t("get_advice")}
                </motion.button>
              </>
            ) : (
              <p className="text-gray-800 font-medium text-base md:text-lg">
                {advice}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
