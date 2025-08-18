import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateTo = () => {
    if (localStorage.getItem("access")) {
      navigate("/test");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 flex items-center justify-center relative overflow-hidden px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center max-w-lg"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-700 mb-4">
          {t("welcome_title", "Bizning WebinarAPP ga xush kelibsiz!")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-700">
          {t("welcome_subtitle", "Hisobingizga kiring yoki yangi hisob oching")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-white backdrop-blur-lg bg-opacity-70 shadow-2xl rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-md flex flex-col gap-4 sm:gap-5 md:gap-6 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={navigateTo}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 sm:py-3 rounded-xl shadow-lg font-semibold text-base sm:text-lg md:text-lg transition-all"
        >
          {t("login", "Hisobga kirish")}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/register")}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 sm:py-3 rounded-xl shadow-lg font-semibold text-base sm:text-lg md:text-lg transition-all"
        >
          {t("sign_up", "Yangi hisob ochish")}
        </motion.button>
      </motion.div>

      <motion.div
        className="absolute -top-32 -left-32 w-64 sm:w-72 md:w-80 h-64 sm:h-72 md:h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-64 sm:w-72 md:w-80 h-64 sm:h-72 md:h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
