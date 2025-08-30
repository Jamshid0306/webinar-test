import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import {
  motion,
  AnimatePresence,
  Variants,
  TargetAndTransition,
} from "framer-motion";
import {
  FaTelegramPlane,
  FaInstagram,
  FaChevronDown,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaSync,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { easeIn, easeOut } from "framer-motion";

interface BusinessOption {
  id: number;
  types: string;
}

interface Question {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  bussiness: BusinessOption;
}

interface WelcomeModalProps {
  options: BusinessOption[];
  onStart: (businessId: number) => void;
}

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  total: number;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ResultScreenProps {
  onReset: () => void;
}

interface SocialButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  clicked: boolean;
  onClick: () => void;
  color: "blue" | "pink" | "green";
}

// ===========================
//        ANIMATIONS
// ===========================
const animations: Record<string, Variants> = {
  page: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", duration: 0.8 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  },
  modalContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, ease: easeOut } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: easeIn } },
  },
  modalContent: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
  },
  staggerContainer: {
    visible: { transition: { staggerChildren: 0.07 } },
  },
  staggerItem: {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
  },
};

// ===========================
//      SUB-COMPONENTS
// ===========================
const WelcomeModal: React.FC<WelcomeModalProps> = ({ options, onStart }) => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
      }}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-gradient-to-r from-blue-300/60 via-blue-100/40 to-blue-300/50 backdrop-blur-lg flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 25 },
        }}
        exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.2 } }}
        className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Тахлилга хуш келибсиз!
          </h2>
          <p className="text-slate-600">Бошлаш учун, бизнес турини танланг.</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex justify-between items-center bg-slate-100/80 text-slate-800 px-5 py-3.5 rounded-xl border border-slate-200/80 hover:border-blue-400 transition-all"
          >
            <span className="font-medium">
              {selectedBusinessId !== null
                ? options.find((opt) => opt.id === selectedBusinessId)?.types
                : "Бизнес турини танланг"}
            </span>
            <FaChevronDown
              className={`transition-transform duration-300 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.25 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg z-50 overflow-auto max-h-60 border border-slate-200"
              >
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSelectedBusinessId(opt.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 transition-colors text-sm font-medium ${
                      selectedBusinessId === opt.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {opt.types}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          disabled={selectedBusinessId === null}
          onClick={() =>
            selectedBusinessId !== null && onStart(selectedBusinessId)
          }
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97, y: 0 }}
          className="w-full mt-8 py-3.5 rounded-xl text-white font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 disabled:shadow-none"
        >
          Тестни бошланг
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentIndex,
  total,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="h-[100vh] border flex items-center bg-blue-200">
      <motion.div
        key={currentIndex}
        variants={animations.page}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-gradient-to-br from-indigo-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl mx-auto border border-white/30"
      >
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" as any }}
          />
        </div>

        <div className="text-sm font-medium text-slate-500 mb-4 flex justify-between">
          <span>
            Савол {currentIndex + 1} дан {total}
          </span>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-8">
          {question.question}
        </h2>

        <motion.div
          variants={animations.staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-8"
        >
          {(["option_a", "option_b", "option_c"] as const).map((key) => {
            const value = question[key];
            if (!value) return null;
            const isSelected = selectedAnswer === value; // bu to'g'ri ishlashi kerak
            return (
              <motion.div
                key={`${currentIndex}-${key}`}
                variants={animations.staggerItem}
                onClick={() => onAnswer(value)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer w-full text-left p-4 rounded-xl border-2 flex items-center transition-all duration-300 ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-500 text-indigo-800 shadow-lg shadow-indigo-500/10"
                    : "bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-500/5"
                }`}
              >
                <motion.div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0"
                  animate={{
                    backgroundColor: isSelected ? "#6366F1" : "#FFFFFF",
                    borderColor: isSelected ? "#6366F1" : "#E2E8F0",
                  }}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <FaCheck className="text-white text-xs" />
                    </motion.div>
                  )}
                </motion.div>
                <span className="font-medium text-slate-800">{value}</span>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex justify-between items-center mt-10">
          <motion.button
            onClick={onPrev}
            disabled={currentIndex === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaArrowLeft />
            <span>Олдинги</span>
          </motion.button>

          <motion.button
            onClick={onNext}
            disabled={!selectedAnswer}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
            className="px-7 py-3 rounded-xl flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-lg shadow-indigo-500/20 disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <span>{currentIndex === total - 1 ? "Тугатмоқ" : "Кейинги"}</span>
            <FaArrowRight />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const SocialButton: React.FC<SocialButtonProps> = ({
  icon: Icon,
  label,
  clicked,
  onClick,
  color,
}) => {
  const colors: Record<
    string,
    { bg: string; border: string; text: string; hover?: string }
  > = {
    blue: {
      bg: "bg-gradient-to-r from-blue-400 to-blue-600",
      border: "border-blue-600",
      text: "text-white",
      hover: "hover:brightness-110",
    },
    pink: {
      bg: "bg-gradient-to-r from-pink-400 to-pink-600",
      border: "border-pink-600",
      text: "text-white",
      hover: "hover:brightness-110",
    },
    green: {
      bg: "bg-gradient-to-r from-green-400 to-green-600",
      border: "border-green-600",
      text: "text-white",
      hover: "hover:brightness-110",
    },
  };

  const current = clicked
    ? { bg: "bg-green-400", border: "border-green-600", text: "text-white" }
    : colors[color];

  return (
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 font-semibold transition-all duration-300 ${
        current.bg
      } ${current.border} ${current.text} ${current.hover || ""}`}
    >
      <Icon />
      <span>{label}</span>
      {clicked && <FaCheck />}
    </a>
  );
};

const ResultScreen: React.FC<ResultScreenProps> = ({ onReset }) => {
  const [showAdvice, setShowAdvice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [tgClicked, setTgClicked] = useState(false);
  const [igClicked, setIgClicked] = useState(false);

  const handleGetAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      setAdvice(
        "Based on your answers, we recommend the following:\n\n• Re-evaluate your current marketing strategy to identify new growth channels.\n• Increase your engagement on social media platforms to build a stronger community.\n• Consider implementing a CRM system to improve customer relationship management. ✅"
      );
      setShowAdvice(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      variants={animations.page}
      initial="hidden"
      animate="visible"
      className="w-[100vw] justify-center h-[100vh] flex items-center bg-blue-200"
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center border border-slate-200/80">
        <AnimatePresence mode="wait">
          {!showAdvice ? (
            <motion.div key="subscribe" variants={animations.page} exit="exit">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FaCheck className="w-10 h-10" />
              </motion.div>

              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Тест тугади!
              </h1>
              <p className="text-slate-600 mb-8">Жавобларингиз учун раҳмат.</p>

              <div className="bg-slate-50/80 p-6 rounded-xl border border-slate-200 mb-8">
                <p className="text-slate-700 mb-4">
                  Шахсий маслахатларингизни олиш учун каналларимизга обуна
                  бўлинг:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <SocialButton
                    icon={FaTelegramPlane}
                    label="Telegram"
                    clicked={tgClicked}
                    onClick={() => {
                      setTgClicked(true);
                      window.open("https://t.me/ravshanpulatjon", "_blank");
                    }}
                    color="blue"
                  />

                  <SocialButton
                    icon={FaInstagram}
                    label="Instagram"
                    clicked={igClicked}
                    onClick={() => {
                      setIgClicked(true);
                      window.open(
                        "https://www.instagram.com/ravshan_pulatjon?igsh=ano5ZWRzc2Z6eDV4",
                        "_blank"
                      );
                    }}
                    color="pink"
                  />
                </div>
              </div>

              <motion.button
                onClick={handleGetAdvice}
                disabled={!tgClicked || !igClicked || loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98, y: 0 }}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all bg-gradient-to-r from-indigo-500 to-blue-500 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 disabled:shadow-none"
              >
                {loading ? (
                  <CgSpinner className="animate-spin text-2xl mx-auto" />
                ) : (
                  "Шахсий маслахат олинг"
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="advice" variants={animations.page}>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Сизнинг тавсияларингиз
              </h2>
              <p className="text-slate-600 mb-6">
                Жавобларингиз асосида тайёрланди.
              </p>
              <div className="bg-indigo-50/70 rounded-xl p-6 text-left text-slate-800 whitespace-pre-line border border-indigo-200/50 max-h-80 overflow-y-auto font-medium">
                {advice}
              </div>
              <button
                onClick={onReset}
                className="mt-8 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 mx-auto transition-colors"
              >
                <FaSync />
                <span>Тестни қайта ечинг</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ===========================
//        MAIN COMPONENT
// ===========================

export default function TestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { options } = useSelector((state: RootState) => state.test);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [testState, setTestState] = useState<
    "selecting" | "testing" | "finished"
  >("selecting");

  const optionsArray: BusinessOption[] =
    options && !Array.isArray(options) ? Object.values(options) : options || [];

  useEffect(() => {
    if (!options || options.length === 0) {
      dispatch(fetchOptions());
    }
  }, [dispatch, options]);

  const handleStartTest = (businessId: number) => {
    if (businessId !== null) {
      dispatch(submitSelection({ businessId }))
        .unwrap()
        .then((res) => {
          setQuestions(Array.isArray(res) ? res : [res]);
          setTestState("testing");
        });
    }
  };
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTestState("finished");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleReset = () => {
    setTestState("selecting");
    setCurrentIndex(0);
    setSelectedAnswers({});
  };

  return (
    <AnimatePresence mode="wait">
      {testState === "selecting" && optionsArray.length > 0 && (
        <WelcomeModal
          key="modal"
          options={optionsArray}
          onStart={handleStartTest}
        />
      )}
      {testState === "testing" && questions.length > 0 && (
        <QuestionScreen
          key={currentIndex}
          question={questions[currentIndex]}
          currentIndex={currentIndex}
          total={questions.length}
          selectedAnswer={selectedAnswers[currentIndex]}
          onAnswer={handleAnswerSelect}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      {testState === "finished" && (
        <ResultScreen key="result" onReset={handleReset} />
      )}
    </AnimatePresence>
  );
}
