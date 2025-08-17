// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginForm from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Notification from "./components/Notification";
import { RootState } from "./store/store";
import TestPage from "./pages/TestPage";
import "./i18n/index";
import HomePage from "./pages/HomePage";

function App() {
  const notification = useSelector((state: RootState) => state.notification);

  return (
    <>
      {notification.message && notification.type && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Routes>
        <Route path="/auth" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
