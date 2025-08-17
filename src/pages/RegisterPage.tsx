import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { registerUser } from "../store/authSlice";
import { AppDispatch, RootState } from "../store/store";
import { setNotification } from "../store/notificationSlice";
import Notification from "../components/Notification";
import { motion } from "framer-motion";

export default function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const notification = useSelector((state: RootState) => state.notification);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("998")) value = value.slice(3);
    let formatted = "+998";
    if (value.length > 0) formatted += " " + value.substring(0, 2);
    if (value.length > 2) formatted += " " + value.substring(2, 5);
    if (value.length > 5) formatted += " " + value.substring(5, 7);
    if (value.length > 7) formatted += " " + value.substring(7, 9);
    setPhone_number(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(
      registerUser({ username, phone_number, password })
    );
    console.log(result);

    if (registerUser.fulfilled.match(result) && result.payload?.token) {
      dispatch(
        setNotification({
          message: "User created successfully!",
          type: "success",
        })
      );
      navigate("/auth");
    } else {
      dispatch(
        setNotification({ message: "Registration failed!", type: "error" })
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 relative overflow-hidden">
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-white backdrop-blur-lg bg-opacity-70 shadow-2xl rounded-3xl p-10 w-full max-w-md relative overflow-hidden"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold text-purple-700 text-center mb-8 tracking-wide"
        >
          Create an Account
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-gray-700 font-medium transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
            required
          />
          <motion.input
            type="tel"
            value={phone_number}
            onFocus={() => {
              if (!phone_number) setPhone_number("+998 ");
            }}
            onChange={handlePhoneChange}
            placeholder="Phone Number"
            maxLength={17}
            className="border border-gray-300 rounded-xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-gray-700 font-medium transition-all duration-300"
            whileFocus={{ scale: 1.02 }}
            required
          />

          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border border-gray-300 rounded-xl p-4 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-gray-700 font-medium transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 transition-colors duration-300"
            >
              {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
            </button>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-3 w-full rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl tracking-wide text-lg"
          >
            Register
          </motion.button>
        </form>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center text-gray-700 font-medium"
        >
          Already have an account?{" "}
          <Link
            to="/auth"
            className="text-purple-500 hover:text-purple-700 font-semibold transition-colors duration-300"
          >
            Login
          </Link>
        </motion.p>
      </motion.div>
      <motion.div
        className="absolute -top-32 -left-32 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
