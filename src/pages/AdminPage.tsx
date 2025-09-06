import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegTrashAlt } from "react-icons/fa";
interface Business {
  id: number;
  types: string;
}

interface Test {
  id: number;
  question: string;
  option_a: string;
  option_a_score: number;
  option_b: string;
  option_b_score: number;
  option_c: string;
  option_c_score: number;
  option_d: string;
  option_d_score: number;
  bussiness: Business;
}

export default function AdminPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionAScore, setOptionAScore] = useState<number | "">("");
  const [optionB, setOptionB] = useState("");
  const [optionBScore, setOptionBScore] = useState<number | "">("");
  const [optionC, setOptionC] = useState("");
  const [optionCScore, setOptionCScore] = useState<number | "">("");
  const [optionD, setOptionD] = useState("");
  const [optionDScore, setOptionDScore] = useState<number | "">("");
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [newBusiness, setNewBusiness] = useState("");

  const url = import.meta.env.VITE_API_BASE_URL;
  const axiosConfig = { headers: { "ngrok-skip-browser-warning": "true" } };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTests();
      fetchBusinesses();
    }
  }, [isLoggedIn]);

  const fetchTests = () =>
    axios.get(`${url}/tests/`, axiosConfig).then((res) => setTests(res.data));
  const fetchBusinesses = () =>
    axios
      .get(`${url}/businesses/`, axiosConfig)
      .then((res) => setBusinesses(res.data));

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${url}/admin/login`,
        new URLSearchParams({
          username,
          password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      setError("");
    } catch (err) {
      setError("Username yoki password noto‘g‘ri!");
    }
  };
  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "ngrok-skip-browser-warning": "true",
    },
  };

  const handleAddTest = () => {
    if (!businessId) return alert("Biznesni tanlang!");
    const newTest = {
      question,
      option_a: optionA,
      option_a_score: Number(optionAScore),
      option_b: optionB,
      option_b_score: Number(optionBScore),
      option_c: optionC,
      option_c_score: Number(optionCScore),
      option_d: optionD,
      option_d_score: Number(optionDScore),
      bussiness_id: businessId,
    };
    axios.post(`${url}/tests/`, newTest, authConfig).then((res) => {
      setTests([...tests, res.data]);
      setShowTestModal(false);
      setQuestion("");
      setOptionA("");
      setOptionAScore("");
      setOptionB("");
      setOptionBScore("");
      setOptionC("");
      setOptionCScore("");
      setOptionD("");
      setOptionDScore("");
      setBusinessId(null);
    });
  };

  const handleDeleteTest = (id: number) => {
    if (window.confirm("Siz rostdan ham ushbu testni o‘chirmoqchimisiz?")) {
      axios
        .delete(`${url}/tests/${id}`, authConfig)
        .then(() => setTests(tests.filter((t) => t.id !== id)));
    }
  };

  const handleAddBusiness = () => {
    if (!newBusiness.trim()) return alert("Biznes nomini kiriting!");
    const biz = { types: newBusiness };
    axios.post(`${url}/businesses/`, biz).then((res) => {
      setBusinesses([...businesses, res.data]);
      setNewBusiness("");
      setShowBusinessModal(false);
    });
  };

  const handleDeleteBusiness = (id: number) => {
    if (window.confirm("Siz rostdan ham ushbu biznesni o‘chirmoqchimisiz?")) {
      axios.delete(`${url}/businesses/${id}`).then(() => {
        setBusinesses(businesses.filter((b) => b.id !== id));
        setTests(tests.filter((t) => t.bussiness.id !== id));
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-500 to-indigo-500">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-white p-8 rounded-3xl shadow-2xl w-[400px]"
        >
          <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
            🔑 Admin Login
          </h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border w-full p-3 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-3 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-700 transition"
          >
            ✅ Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
        📋 Admin Panel — Testlar va Bizneslar
      </h1>

      <div className="max-w-6xl mx-auto">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">🏢 Bizneslar</h2>
            <button
              onClick={() => setShowBusinessModal(true)}
              className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl shadow-lg hover:bg-indigo-100 transition"
            >
              ➕ Yangi Biznes Qo‘shish
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {businesses.map((biz) => (
                <motion.div
                  key={biz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-200 flex justify-between items-center"
                >
                  <p className="text-xl font-bold text-gray-800">{biz.types}</p>
                  <button
                    onClick={() => handleDeleteBusiness(biz.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    <FaRegTrashAlt />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">📝 Testlar</h2>
            <button
              onClick={() => setShowTestModal(true)}
              className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl shadow-lg hover:bg-indigo-100 transition"
            >
              ➕ Yangi Test Qo‘shish
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {tests.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white relative rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-200"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {test.question}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                      A: {test.option_a}{" "}
                      <span className="text-sm text-gray-500">
                        ({test.option_a_score} bal)
                      </span>
                    </li>
                    <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                      B: {test.option_b}{" "}
                      <span className="text-sm text-gray-500">
                        ({test.option_b_score} bal)
                      </span>
                    </li>
                    <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                      C: {test.option_c}{" "}
                      <span className="text-sm text-gray-500">
                        ({test.option_c_score} bal)
                      </span>
                    </li>
                    <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                      D: {test.option_d}{" "}
                      <span className="text-sm text-gray-500">
                        ({test.option_d_score} bal)
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-3">
                    🏢 Biznes:{" "}
                    <span className="font-medium">{test.bussiness.types}</span>
                  </p>
                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="text-red-500 text-xl right-[15px] rounded hover:scale-[1.1] transition cursor-pointer absolute top-[10px]"
                  >
                    <FaRegTrashAlt />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600/50 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white rounded-2xl shadow-2xl w-[400px] p-6"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-4 text-center">
                ➕ Yangi Test Qo‘shish
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Savol"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option A"
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={optionAScore}
                    onChange={(e) => setOptionAScore(Number(e.target.value))}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option B"
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={optionBScore}
                    onChange={(e) => setOptionBScore(Number(e.target.value))}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option C"
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={optionCScore}
                    onChange={(e) => setOptionCScore(Number(e.target.value))}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Option D"
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Score"
                    value={optionDScore}
                    onChange={(e) => setOptionDScore(Number(e.target.value))}
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
                <select
                  value={businessId ?? ""}
                  onChange={(e) => setBusinessId(Number(e.target.value))}
                  className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Biznesni tanlang</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.types}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowTestModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  ❌ Bekor qilish
                </button>
                <button
                  onClick={handleAddTest}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  ✅ Saqlash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBusinessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600/50 bg-opacity-50 flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="bg-white rounded-2xl shadow-2xl w-[400px] p-6"
            >
              <h2 className="text-xl font-bold text-indigo-600 mb-4 text-center">
                ➕ Yangi Biznes Qo‘shish
              </h2>
              <input
                type="text"
                placeholder="Biznes nomi"
                value={newBusiness}
                onChange={(e) => setNewBusiness(e.target.value)}
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none mb-4"
              />
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={() => setShowBusinessModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  ❌ Bekor qilish
                </button>
                <button
                  onClick={handleAddBusiness}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  ✅ Saqlash
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
