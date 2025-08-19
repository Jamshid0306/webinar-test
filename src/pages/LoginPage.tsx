import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { motion } from "framer-motion";
import { registerUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, isLoggedIn, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [fullname, setFullname] = useState("");
  const [age, setAge] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // 🔹 Agar foydalanuvchi ro‘yxatdan o‘tsa → /test sahifasiga yuborish
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/test");
    }
  }, [isLoggedIn, navigate]);

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
    setLocalError(null);

    if (!fullname || !age || !phone_number) {
      setLocalError("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    const result = await dispatch(registerUser({ fullname, age, phone_number }));

    if (registerUser.fulfilled.match(result)) {
      // endi navigate ishlaydi, alert shart emas
      setFullname("");
      setAge("");
      setPhone_number("+998 ");
    } else {
      setLocalError((result.payload as any)?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
      >
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Ro'yxatdan o'tish</h1>
          <p className="text-blue-100 mt-1">
            Iltimos, quyidagi maydonlarni to'ldiring
          </p>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8">
          {(localError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {localError || error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ismingiz
              </label>
              <motion.input
                id="fullname"
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="To'liq ismingiz"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Yoshingiz
              </label>
              <motion.select
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjJ2MnYyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em]"
                required
                whileFocus={{ scale: 1.01 }}
              >
                <option value="">Yoshingizni tanlang</option>
                <option value="18-21">18 - 21 yosh</option>
                <option value="21-25">21 - 25 yosh</option>
                <option value="25-30">25 - 30 yosh</option>
                <option value="30+">30+ yosh</option>
              </motion.select>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefon raqam
              </label>
              <motion.input
                id="phone"
                type="tel"
                value={phone_number}
                onFocus={() => {
                  if (!phone_number.startsWith("+998"))
                    setPhone_number("+998 ");
                }}
                onChange={handlePhoneChange}
                placeholder="+998 __ ___ __ __"
                maxLength={17}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200"
                required
                whileFocus={{ scale: 1.01 }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Yuborilmoqda...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                  Yuborish
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Form Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Formani to'ldirish orqali siz{" "}
            <a href="#" className="text-blue-600 hover:underline">
              foydalanish shartlari
            </a>
            ga rozilik bildirasiz
          </p>
        </div>
      </motion.div>
    </div>
  );
}
