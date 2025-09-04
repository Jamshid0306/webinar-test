import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiArrowRight,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";

export default function UserFormV2() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, isLoggedIn, error: serverError } = useSelector(
    (state: RootState) => state.auth
  );

  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) navigate("/test");
  }, [isLoggedIn, navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("998")) value = value.slice(3);
    let formatted = "+998";
    if (value.length > 0) formatted += " (" + value.substring(0, 2) + ")";
    if (value.length > 2) formatted += " " + value.substring(2, 5);
    if (value.length > 5) formatted += "-" + value.substring(5, 7);
    if (value.length > 7) formatted += "-" + value.substring(7, 9);
    setPhone_number(formatted.slice(0, 19));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (!fullname || !age || phone_number.length < 19) {
      setLocalError("Илтимос, барча майдонларни тўғри тўлдиринг.");
      return;
    }
    dispatch(registerUser({ fullname, age, phone_number }));
  };

  const error = localError || serverError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-blue-100 p-4 font-sans">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
      >
        <div className="p-8 md:p-10">
          {/* Header */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="inline-block p-4 bg-cyan-100 rounded-full mb-4">
              <FiUserPlus className="text-4xl text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Ҳисоб яратиш</h1>
            <p className="text-slate-500 mt-2">
              Бошлаш учун маълумотларингизни киритинг
            </p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-3 text-sm"
              >
                <FiAlertTriangle className="text-xl flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Fullname */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Исмингиз
              </label>
              <input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Тўлиқ исмингиз"
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition duration-200 outline-none text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            {/* Age */}
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Ёшингиз
              </label>
              <div className="relative">
                <select
                  id="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition duration-200 appearance-none outline-none"
                  required
                >
                  <option value="" disabled>
                    Ёшингизни танланг
                  </option>
                  <option value="18-21">18 - 21 ёш</option>
                  <option value="21-25">21 - 25 ёш</option>
                  <option value="25-30">25 - 30 ёш</option>
                  <option value="30+">30+ ёш</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-600 mb-1"
              >
                Телефон рақам
              </label>
              <input
                id="phone"
                type="tel"
                value={phone_number}
                onChange={handlePhoneChange}
                placeholder="+998 (__) ___-__-__"
                className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 border border-slate-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition duration-200 outline-none placeholder-slate-400"
                required
              />
            </div>

            {/* Button */}
            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-cyan-500/40 text-white font-semibold py-3.5 px-4 rounded-lg shadow-md shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-3 h-5 w-5" />
                    <span>Юборилмоқда...</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">Юбориш</span>
                    <FiArrowRight className="text-xl" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
