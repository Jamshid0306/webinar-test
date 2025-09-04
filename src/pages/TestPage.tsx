import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchOptions, submitSelection } from "../store/testSlice";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FaTelegramPlane,
  FaInstagram,
  FaChevronDown,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaSync,
  FaChevronLeft,
  FaChevronRight,
  FaSatellite,
  FaMask, // TheaterMasks o‘rniga
  FaTrophy,
  FaSpider,
  FaGlobeAmericas,
  FaBicycle,
  FaRocket,
  FaBinoculars,
  FaTheaterMasks,
  FaStar,
  FaCloud,
  FaBolt,
  FaMoon,
  FaSun,
  FaHeart, // kerak bo‘lsa qoldiring
} from "react-icons/fa";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

// import { GiTelescope, GiHotAirBalloon } from "react-icons/gi";

import { CgSpinner } from "react-icons/cg";
import { easeIn, easeOut } from "framer-motion";

// --- INTERFACES & PROPS (No changes) ---
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
  option_d?: string;
  option_a_score: number;
  option_b_score: number;
  option_c_score: number;
  option_d_score?: number;
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

interface SocialButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  clicked: boolean;
  onClick: () => void;
  color: "blue" | "pink" | "green";
}

// --- ANIMATION VARIANTS (No changes) ---
const animations: Record<string, Variants> = {
  page: {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", duration: 0.7 },
    },
    exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.3 } },
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
};

// --- WELCOME MODAL COMPONENT (No changes) ---
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

// --- QUESTION SCREEN COMPONENT (MODIFIED) ---
const QuestionScreen: React.FC<QuestionScreenProps> = ({
  question,
  currentIndex,
  total,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrev,
}) => {
  const options = [
    question.option_a,
    question.option_b,
    question.option_c,
    question.option_d,
  ].filter(Boolean) as string[];

  return (
    <motion.div
      key={currentIndex}
      variants={animations.page}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col items-center justify-center w-full px-4"
    >
      <div className="relative w-full max-w-xl">
        {/* Layered borders for styling */}
        <div className="absolute inset-0 bg-green-400 rotate-[-5deg] rounded-3xl transform -translate-y-2"></div>
        <div className="absolute inset-0 bg-yellow-300 rotate-[5deg] rounded-3xl transform translate-y-1"></div>

        <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg z-10">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 text-center mb-8 min-h-[6rem] flex items-center justify-center">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {options.map((value, index) => {
              const isSelected = selectedAnswer === value;
              return (
                <motion.button
                  key={index}
                  onClick={() => onAnswer(value)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-center p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
                    isSelected
                      ? "bg-green-500 border-green-600 text-white shadow-md"
                      : "bg-white border-slate-300 text-slate-700 hover:border-blue-400"
                  }`}
                >
                  {value}
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center justify-center space-x-2 text-slate-500">
            <motion.button
              onClick={onPrev}
              disabled={currentIndex === 0}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[50px] cursor-pointer disabled:opacity-30 text-yellow-500 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              <RiArrowLeftSFill />
            </motion.button>
            <span className="font-bold flex gap-[7px] items-center tabular-nums">
              <p className="text-green-500 text-4xl">{currentIndex + 1}</p>
              <p className="text-xl">/ {total}</p>
            </span>
            <motion.button
              onClick={() => {
                if (selectedAnswer) {
                  onNext();
                }
              }}
              disabled={!selectedAnswer}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[50px] disabled:opacity-30 cursor-pointer text-yellow-500 disabled:cursor-not-allowed"
            >
              <RiArrowRightSFill />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- DECORATIVE ICONS COMPONENT (NEW) ---
const DecorativeIcons = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    {/* Asosiy ikonalar */}
    <FaSatellite className="text-black/10 absolute top-[8%] left-[5%] text-5xl transform -rotate-12" />
    <FaTheaterMasks className="text-black/10 absolute top-[50%] right-[8%] text-4xl" />
    <FaTrophy className="text-black/10 absolute top-[78%] right-[12%] text-5xl" />
    <FaSpider className="text-black/10 absolute bottom-[12%] left-[18%] text-4xl" />
    <FaGlobeAmericas className="text-black/10 absolute bottom-[6%] left-[45%] text-6xl" />
    <FaBicycle className="text-black/10 absolute bottom-[18%] right-[6%] text-6xl" />
    <FaRocket className="text-black/10 absolute top-[72%] left-[4%] text-5xl transform rotate-45" />

    {/* Qo‘shimcha dekorativ ikonalar */}
    <FaBinoculars className="text-black/5 absolute top-[20%] left-[20%] text-6xl" />
    <FaStar className="text-yellow-400/20 absolute top-[10%] right-[20%] text-4xl" />
    {/* <FaCloud className="text-slate-500/10 absolute top-[30%] left-[70%] text-7xl" /> */}
    <FaBolt className="text-yellow-500/10 absolute bottom-[25%] left-[30%] text-5xl rotate-12" />
    <FaMoon className="text-indigo-500/10 absolute top-[15%] right-[40%] text-5xl" />
    <FaSun className="text-orange-400/10 absolute bottom-[15%] right-[20%] text-6xl" />
    <FaHeart className="text-red-500/10 absolute bottom-[30%] left-[10%] text-5xl animate-pulse" />
    <FaInstagram className="text-pink-500/10 absolute top-[40%] left-[5%] text-4xl rotate-6" />
    <FaTelegramPlane className="text-blue-500/10 absolute bottom-[40%] right-[10%] text-5xl -rotate-6" />
  </div>
);

// --- OTHER COMPONENTS (No major changes) ---
const CircularProgress: React.FC<{ value: number; max: number }> = ({
  value,
  max,
}) => {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#E5E7EB"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle"
          className="text-lg font-bold fill-slate-800"
        >
          {`${value}/${max}`}
        </text>
      </svg>
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

interface ResultScreenProps {
  onReset: () => void;
  questions: Question[];
  selectedAnswers: { [key: number]: string };
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  onReset,
  questions,
  selectedAnswers,
}) => {
  const [showAdvice, setShowAdvice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState("");
  const [tgClicked, setTgClicked] = useState(false);
  const [igClicked, setIgClicked] = useState(false);

  const calculateScore = () => {
    let total = 0;
    questions.forEach((q, idx) => {
      const answer = selectedAnswers[idx];
      if (answer === q.option_a) total += q.option_a_score;
      if (answer === q.option_b) total += q.option_b_score;
      if (answer === q.option_c) total += q.option_c_score;
      if (answer === q.option_d) total += q.option_d_score || 0;
    });
    return total;
  };

  const handleGetAdvice = () => {
    setLoading(true);
    setTimeout(() => {
      const score = calculateScore();
      let text = `Сизнинг жами баллингиз: ${score}\n\n`;

      if (score >= 25 && score <= 45) {
        text +=
          "📊 Даража: Бошланғич даража.\n\n" +
          "Сиз ҳали тадбиркорлик дунёсига қадам қўйганингизда турибсиз. " +
          "Асосий билимлар ва амалий тажриба етарли даражада эмас. " +
          "Бу нормал ҳолат, чунки ҳар бир катта йўл кичик қадамлардан бошланади.\n\n" +
          "📝 Тавсия: Аввало, бизнес асосларини пухта ўрганишга ҳаракат қилинг. " +
          "Кичик лойиҳаларда иштирок этинг ёки озгина маблағ билан " +
          "бизнес бошлаб кўринг. Шошилмасдан, босқичма-босқич тажриба орттириш " +
          "сизга катта имкониятларни очади. Бу босқичда йўл қўйилган хатолар — " +
          "буюк дарсларга айланади.\n";
      } else if (score >= 46 && score <= 65) {
        text +=
          "📊 Даража: Амалиётчи даражаси.\n\n" +
          "Сиз тадбиркорлик йўлида аввалги қадамларни босиб ўтдингиз. " +
          "Асосий тушунчалардан хабардорсиз ва кичик бизнесни йўлга қўйишни билиб олагансиз. " +
          "Бироқ ҳали ҳам маълум хатоларга йўл қўйишингиз мумкин. " +
          "Бу табиий жараён, чунки билим ва тажриба орттириш узлуксиз жараёндир.\n\n" +
          "📝 Тавсия: Бу босқичда сизга ментор — тажрибали тадбиркор маслаҳати жуда керак бўлади. " +
          "Курслар ёки тренингларда иштирок этиш, бизнес бошқарувини ўрганиш, " +
          "иш жараёнларини таҳлил қилиш орқали катта ютуқларга эриша оласиз. " +
          "Шунингдек, рақобатчиларни кузатинг ва уларнинг тажрибаларидан илҳомланинг.\n";
      } else if (score >= 66 && score <= 85) {
        text +=
          "📊 Даража: Тадбиркор даражаси.\n\n" +
          "Сиз аллақачон асосий жараёнларни яхши тушунасиз ва бизнесни мустақил равишда " +
          "бошқариш қобилиятига эгасиз. Дўкон ёки хизмат кўрсатиш соҳасида ўзини намоён қилишда " +
          "муваффақиятга эришишингиз мумкин. Ҳали айрим жиҳатларда самарадорликни ошириш имкониятлари бор.\n\n" +
          "📝 Тавсия: Бу босқичда асосий эътиборни автоматлаштириш, маркетинг ва мижозлар билан муносабатларга қаратинг. " +
          "Дижитал технологиялардан фойдаланиш, CRM тизимини йўлга қўйиш ва онлайн реклама " +
          "сизга катта ютуқлар олиб келиши мумкин. Мақсадингиз — бизнесни барқарор ва кенгайтириладиган ҳолатга олиб чиқиш.\n";
      } else if (score >= 86 && score <= 100) {
        text +=
          "📊 Даража: Профессионал даража.\n\n" +
          "Сиз тадбиркорликда юқори тажрибага эгасиз ва кўпчилик учун намуна ҳисобланасиз. " +
          "Сиз фақатгина дўкон ёки кичик бизнесни эмас, балки бутун тармоқ дўконларини бошқаришга тайёрсиз. " +
          "Бошқарув, молиявий режалаштириш ва стратегия бўйича билимларингиз юқори даражада.\n\n" +
          "📝 Тавсия: Эндиликда мақсад — брендни кучайтириш ва франшиза йўналишини йўлга қўйиш. " +
          "Жамоани кучайтириш, халқаро тажрибаларни ўрганиш ва инновацияларни жорий этиш орқали " +
          "сиз бизнесингизни янги босқичга кўтара оласиз. Энг асосийси, ўз тажрибангизни бошқаларга " +
          "ўргатиш орқали катта ижтимоий таъсирга эга бўласиз.\n";
      } else {
        text += "⚠️ Балл етарли эмас ёки саволлар нотўғри белгиланди.";
      }

      if (questions[0]?.bussiness?.types === "Озиқ-овқат дўкони") {
        text +=
          "\n🍞 Озиқ-овқат дўкони бизнеси ҳақида:\n" +
          "• Асосий муваффақият омиллари: сифатли товар, арзон нарх ва доимий мижоз.\n" +
          "• Сақлаш ва логистика тизимини яхшилаш муҳим.\n" +
          "• Рақобатда устун бўлиш учун акция ва бонус тизимини жорий қилинг.\n" +
          "• Маҳаллий ишлаб чиқарувчилар билан тўғридан-тўғри ҳамкорлик қилинг.\n";
      }

      setAdvice(text);
      setShowAdvice(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      variants={animations.page}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen flex items-center justify-center bg-[#A7D7F9] p-4"
    >
      <div className="bg-white w-full absolute mx-[20px] max-w-2xl rounded-2xl p-8 shadow-xl text-center border border-slate-200/80">
        <AnimatePresence mode="wait">
          {!showAdvice ? (
            <motion.div
              key="subscribe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                        "https://www.instagram.com/ravshan_pulatjon",
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
            <motion.div
              key="advice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Сизнинг тавсияларингиз
              </h2>
              <p className="text-slate-600 mb-6">
                Жавобларингиз асосида тайёрланди.
              </p>
              <CircularProgress value={calculateScore()} max={100} />

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

// --- MAIN PAGE COMPONENT (MODIFIED) ---
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

  useEffect(() => {
    dispatch(fetchOptions());
  }, [dispatch]);

  const handleStart = async (businessId: number) => {
    const result = await dispatch(submitSelection({ businessId }));
    if (submitSelection.fulfilled.match(result)) {
      setQuestions(result.payload);
      setTestState("testing");
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setTestState("finished");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTestState("selecting");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#A7D7F9] relative overflow-hidden font-sans">
      <DecorativeIcons />
      <AnimatePresence mode="wait">
        {testState === "selecting" && (
          <WelcomeModal key="welcome" options={options} onStart={handleStart} />
        )}
        {testState === "testing" && questions.length > 0 && (
          <QuestionScreen
            key={currentIndex}
            question={questions[currentIndex]}
            currentIndex={currentIndex}
            total={questions.length}
            selectedAnswer={selectedAnswers[currentIndex]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {testState === "finished" && (
          <ResultScreen
            key="result"
            onReset={handleReset}
            questions={questions}
            selectedAnswers={selectedAnswers}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
