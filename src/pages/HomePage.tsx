import React, { JSX } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateTo = () => {
    navigate("/auth");
  };

  // Floating background circles
  const BackgroundElements = () => {
    const elements: JSX.Element[] = [];
    const colors = ["from-sky-200", "from-blue-200", "from-indigo-200"];

    for (let i = 0; i < 10; i++) {
      const size = Math.random() * 150 + 100;
      const duration = Math.random() * 8 + 6;
      const delay = Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];

      elements.push(
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${color} to-transparent opacity-20`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 150 - 75],
            y: [0, Math.random() * 150 - 75],
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 360],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      );
    }

    return <>{elements}</>;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        <BackgroundElements />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl text-center space-y-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 md:h-12 md:w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t("welcome_title", "Вебинар платформасига")}
          <motion.span
            className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
            style={{ backgroundSize: "200% 200%" }}
          >
            {t("welcome_subtitle", "Хуш келибсиз!")}
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-gray-600 text-lg max-w-lg mx-auto px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {t(
            "welcome_description",
            "Профессионал вебинар платформамизда билим ва тажриба алмашиш учун ҳисобингизга киринг"
          )}
        </motion.p>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/90 shadow-2xl rounded-3xl p-8 space-y-6 border border-gray-100 backdrop-blur"
        >
          <motion.button
            whileHover={{
              scale: 1.03,
              backgroundPosition: "200% center",
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={navigateTo}
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-[length:200%_200%] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 flex items-center justify-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            {t("login", "Кириш")}
          </motion.button>

          <p className="text-sm text-gray-500">
            {t("terms_notice", "Ҳисобга кириш орқали сиз")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("terms", "фойдаланиш шартлари")}
            </a>{" "}
            {t("and", "ва")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("privacy", "махфийлик сиёсати")}
            </a>{" "}
            {t("agree", "га розилик билдирасиз")}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-500 text-sm"
        >
          © {new Date().getFullYear()} {t("company_name", "Webinar Platform")}.{" "}
          {t("all_rights", "Барча ҳуқуқлар ҳимояланган")}.
        </motion.div>
      </div>
    </div>
  );
}
