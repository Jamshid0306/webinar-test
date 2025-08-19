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

  // Background animation elements
  const BackgroundElements = () => {
    const elements: JSX.Element[] = [];
    const colors = [
      "from-blue-400",
      "from-indigo-400",
      "from-purple-400",
      "from-pink-400",
    ];

    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 200 + 100;
      const duration = Math.random() * 4 + 3; // 🟢 faster animation
      const delay = Math.random() * 2; // shorter delay → feels more dynamic
      const color = colors[Math.floor(Math.random() * colors.length)];

      elements.push(
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${color} to-transparent opacity-10`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            scale: 0.5,
          }}
          animate={{
            x: Math.random() * 200 - 100,
            y: Math.random() * 200 - 100,
            scale: Math.random() * 0.5 + 0.5,
            rotate: 360,
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      );
    }

    return <>{elements}</>;
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        <BackgroundElements />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)]" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-2xl text-center space-y-6 md:space-y-8">
        {/* Logo/Icon */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 md:space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            {t("welcome_title", "Webinar Platformaga")}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              {t("welcome_subtitle", "xush kelibsiz!")}
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-600 text-base sm:text-lg md:text-xl max-w-md md:max-w-lg mx-auto px-2"
          >
            {t(
              "welcome_description",
              "Professional webinar platformamizda bilim almashish uchun hisobingizga kiring"
            )}
          </motion.p>
        </motion.div>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/90 shadow-xl rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 border border-gray-100 backdrop-blur-sm"
        >
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={navigateTo}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 md:py-4 px-6 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
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
            {t("login", "Kirish")}
          </motion.button>

          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            {t("terms_notice", "Hisobga kirish orqali siz")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("terms", "foydalanish shartlari")}
            </a>{" "}
            {t("and", "va")}{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              {t("privacy", "maxfiylik siyosati")}
            </a>{" "}
            {t("agree", "ga rozilik bildirasiz")}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-gray-500 text-xs sm:text-sm pt-2 md:pt-4"
        >
          © {new Date().getFullYear()} {t("company_name", "Webinar Platform")}.{" "}
          {t("all_rights", "Barcha huquqlar himoyalangan")}.
        </motion.div>
      </div>
    </div>
  );
}
