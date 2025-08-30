import React, { useEffect, useState } from "react";
import axios from "axios";

interface Business {
  id: number;
  types: string;
}

interface Test {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  bussiness: Business;
}

export default function AdminPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [businessId, setBusinessId] = useState<number | null>(null);

  const [newBusiness, setNewBusiness] = useState("");

  const url = import.meta.env.VITE_API_BASE_URL;
  const axiosConfig = {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  useEffect(() => {
    fetchTests();
    fetchBusinesses();
  }, []);

  const fetchTests = () => {
    axios.get(`${url}/tests/`, axiosConfig).then((res) => setTests(res.data));
  };

  const fetchBusinesses = () => {
    axios
      .get(`${url}/businesses/`, axiosConfig)
      .then((res) => setBusinesses(res.data));
  };

  const handleAddTest = () => {
    if (!businessId) {
      alert("Biznesni tanlang!");
      return;
    }

    const newTest = {
      question,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      bussiness_id: businessId,
    };

    axios.post(`${url}/tests/`, newTest).then((res) => {
      setTests([...tests, res.data]);
      setShowTestModal(false);
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setBusinessId(null);
    });
  };

  const handleDeleteTest = (id: number) => {
    if (window.confirm("Siz rostdan ham ushbu testni o‘chirmoqchimisiz?")) {
      axios.delete(`${url}/tests/${id}`).then(() => {
        setTests(tests.filter((test) => test.id !== id));
      });
    }
  };

  const handleAddBusiness = () => {
    if (!newBusiness.trim()) {
      alert("Biznes nomini kiriting!");
      return;
    }

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
        setBusinesses(businesses.filter((biz) => biz.id !== id));
        // Shu biznesga tegishli testlarni ham yangilash
        setTests(tests.filter((test) => test.bussiness.id !== id));
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
          📋 Admin Panel — Testlar va Bizneslar
        </h1>

        {/* Testlar Bloki */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">📝 Testlar</h2>
            <button
              onClick={() => setShowTestModal(true)}
              className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-xl shadow-lg hover:bg-indigo-100 transition"
            >
              ➕ Yangi Test Qo‘shish
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {test.question}
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                    {test.option_a}
                  </li>
                  <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                    {test.option_b}
                  </li>
                  <li className="px-3 py-2 bg-indigo-50 rounded-lg">
                    {test.option_c}
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-3">
                  🏢 Biznes:{" "}
                  <span className="font-medium">{test.bussiness.types}</span>
                </p>
                <button
                  onClick={() => handleDeleteTest(test.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition w-full"
                >
                  🗑 O‘chirish
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bizneslar Bloki */}
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
            {businesses.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 border border-gray-200 flex justify-between items-center"
              >
                <p className="text-xl font-bold text-gray-800">{biz.types}</p>
                <button
                  onClick={() => handleDeleteBusiness(biz.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  🗑 O‘chirish
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6">
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
              <input
                type="text"
                placeholder="Option A"
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                placeholder="Option B"
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <input
                type="text"
                placeholder="Option C"
                value={optionC}
                onChange={(e) => setOptionC(e.target.value)}
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <select
                value={businessId ?? ""}
                onChange={(e) => setBusinessId(Number(e.target.value))}
                className="border w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Biznesni tanlang</option>
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.types}
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
          </div>
        </div>
      )}

      {/* Business Modal */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6">
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
          </div>
        </div>
      )}
    </div>
  );
}
